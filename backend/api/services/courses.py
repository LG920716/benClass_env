from fastapi import HTTPException
from api.daos.courses import CourseDao
from api.schemas.courses import CourseCreateRequest, CourseUpdateRequest, CourseResponse
from api.utils import generate_random_code

class CourseService:
    def __init__(self):
        self.course_dao = CourseDao()
        
    def create_course(self, course_request: CourseCreateRequest) -> CourseResponse:
        course_id = generate_random_code()
        while self.course_dao.get_course_by_id(course_id):
            course_id = generate_random_code()

        new_course = {
            "id": course_id,
            "course_name": course_request.course_name,
            "teacher_name": course_request.teacher_name,
            "students": [],
            "classes": []
        }
        return self.course_dao.create_course(new_course)

    def update_course(self, course_id: str, course_update: CourseUpdateRequest) -> CourseResponse:
        course_data = self.course_dao.get_course_by_id(course_id)

        if not course_data:
            raise HTTPException(status_code=404, detail=f"Course with ID {course_id} not found")

        action = course_update.action

        if action == "ADD":
            if course_update.student and course_update.student not in course_data.students:
                course_data.students.append(course_update.student)

            students_to_add = course_update.students or []
            course_data.students.extend([s for s in students_to_add if s not in course_data.students])

            classes_to_add = course_update.classes or []
            course_data.classes.extend(classes_to_add)

        elif action == "DELETE":
            if course_update.student and course_update.student in course_data.students:
                course_data.students.remove(course_update.student)

            students_to_remove = course_update.students or []
            course_data.students = [s for s in course_data.students if s not in students_to_remove]

            classes_to_remove = course_update.classes or []
            course_data.classes = [cls for cls in course_data.classes if cls not in classes_to_remove]

        elif action == "UPDATE":
            if course_update.course_name:
                course_data.course_name = course_update.course_name

            if course_update.teacher_name:
                course_data.teacher_name = course_update.teacher_name

        self.course_dao.update_course(course_id, course_data.model_dump())

        return CourseResponse(**course_data.model_dump())
    
    def get_courses_by_teacher(self, teacher_name: str) -> list[CourseResponse]:
        course_data = self.course_dao.get_courses_by_teacher(teacher_name)
        
        if not course_data:
            return []

        courses = [
            CourseResponse(
                id=course["id"],
                course_name=course.get("course_name"),
                teacher_name=course.get("teacher_name"),
                students=course.get("students", []),
                classes=course.get("classes", [])
            )
            for course in course_data
        ]
        
        return courses


    def delete_course(self, course_id: str) -> str:
        course = self.course_dao.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail=f"Course with ID {course_id} not found")

        self.course_dao.delete_course(course_id)
        return f"Course with ID {course_id} has been successfully deleted."

    def query_course_by_id(self, course_id: str) -> CourseResponse:
        course = self.course_dao.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail=f"Course with ID {course_id} not found")
        return course