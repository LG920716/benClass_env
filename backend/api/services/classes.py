from datetime import datetime, date
from random import shuffle
from fastapi import HTTPException
from api.daos.classes import ClassDao
from api.daos.scores import ScoreDao
from api.schemas.classes import Class, ClassUpdateRequest
from api.schemas.courses import CourseUpdateRequest
from api.utils import generate_random_code

class ClassService:
    def __init__(self):
        self.class_dao = ClassDao()
        self.score_dao = ScoreDao() 

    def create_class(self, class_data: Class) -> Class:
        from api.services.courses import CourseService
        course_service = CourseService()

        if isinstance(class_data.date, date):
            class_data.date = datetime(class_data.date.year, class_data.date.month, class_data.date.day)

        new_class = Class(
            id=generate_random_code(),
            course_id=class_data.course_id,
            date=class_data.date,
            enrolled_students=[],
            groups=[]
        )

        course_update = CourseUpdateRequest(
            action = "ADD",
            classes = [new_class.id]
        )
        
        created_class = self.class_dao.create_class(new_class)
        course_service.update_course(new_class.course_id, course_update)
        
        score_data = {
            "class_id": created_class.id,
            "matches": []
        }
        self.score_dao.create_score(score_data)
        
        return created_class

    def update_class(self, class_id: str, class_update: ClassUpdateRequest) -> Class:
        class_data = self.class_dao.get_class_by_id(class_id)
        if not class_data:
            raise HTTPException(status_code=404, detail=f"Class with ID {class_id} not found")

        if class_update.action == "ADD":
            if class_update.student and class_update.student not in class_data.enrolled_students:
                class_data.enrolled_students.append(class_update.student)
            class_data.enrolled_students.extend([s for s in class_update.students if s not in class_data.enrolled_students])

        elif class_update.action == "DELETE":
            if class_update.student in class_data.enrolled_students:
                class_data.enrolled_students.remove(class_update.student)
            class_data.enrolled_students = [s for s in class_data.enrolled_students if s not in class_update.students]

        # elif class_update.action == "UPDATE":
        #     if class_update.date:
        #         class_data.date = class_update.date

        return self.class_dao.update_class(class_id, class_data.model_dump())

    def delete_class(self, id: str) -> str:
        from api.services.courses import CourseService
        course_service = CourseService()

        class_data = self.query_class_by_id(id)

        course_update = CourseUpdateRequest(
            action = "DELETE",
            classes = [id]
        )

        self.score_dao.delete_score(id)
        course_service.update_course(class_data.course_id, course_update)
        return self.class_dao.delete_class(id)

    def query_class_by_id(self, id: str) -> Class:
        class_ = self.class_dao.get_class_by_id(id)
        if not class_:
            raise HTTPException(status_code=404, detail=f"Class with ID {id} not found")
        return Class(**class_.model_dump())

    def grouping(self, id: str):
        from api.services.users import UserService
        from api.services.scores import ScoreService
        from random import shuffle

        user_service = UserService()
        score_service = ScoreService()

        class_data = self.class_dao.get_class_by_id(id)
        enrolled_students = class_data.enrolled_students

        total_students = len(enrolled_students)
        team_count = total_students // 6

        students = [user_service.find_user_by_id(student_id) for student_id in enrolled_students]

        boys = [s for s in students if s['gender'] == 1]
        girls = [s for s in students if s['gender'] == 2]

        shuffle(boys)
        shuffle(girls)

        teams = [[] for _ in range(team_count)]

        boys_per_team = len(boys) // team_count
        girls_per_team = len(girls) // team_count

        for i in range(team_count):
            start_boy_idx = i * boys_per_team
            end_boy_idx = (i + 1) * boys_per_team
            teams[i].extend(boys[start_boy_idx:end_boy_idx])

            start_girl_idx = i * girls_per_team
            end_girl_idx = (i + 1) * girls_per_team
            teams[i].extend(girls[start_girl_idx:end_girl_idx])

        remaining_boys = boys[team_count * boys_per_team:]
        remaining_girls = girls[team_count * girls_per_team:]
        remaining_students = remaining_boys + remaining_girls 

        shuffle(remaining_students)
  
        for i, student in enumerate(remaining_students):
            teams[i % team_count].append(student)

        grouped_data = [{f"team {idx + 1}": [student['id'] for student in team]} for idx, team in enumerate(teams)]

        for group in grouped_data:
            assert isinstance(list(group.keys())[0], str), f"Team key should be a string, got {type(list(group.keys())[0])}"
            assert isinstance(list(group.values())[0], list), f"Members should be a list, got {type(list(group.values())[0])}"
            assert all(isinstance(member, str) for member in list(group.values())[0]), "Each member in 'members' should be a string (student ID)"

        self.class_dao.grouping(id, grouped_data)
        score_service.schedule(id)

        return grouped_data
