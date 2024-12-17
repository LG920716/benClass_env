from datetime import datetime, date
import bcrypt
from fastapi import HTTPException
from api.daos.users import UserDao
from api.services.scores import ScoreService
from api.services.classes import ClassService
from api.schemas.users import UpdateUserScoreSchema, UserCreateRequest, UserUpdateRequest, UserLoginRequest, UserLoginResponse, UserResponse, UserEnrollRequest
from api.schemas.courses import CourseUpdateRequest
from api.schemas.classes import ClassUpdateRequest
from api.utils import validate_enrollment

class UserService:
    def __init__(self):
        self.user_dao = UserDao()
        self.score_service = ScoreService()
        self.class_service = ClassService()

    def register(self, user_register: UserCreateRequest) -> UserResponse:
        return self.user_dao.register(user_register)

    def update_user(self, id: str, user_update: UserUpdateRequest) -> UserResponse:
        return self.user_dao.update_user(id, user_update)

    def delete_user(self, id: str) -> str:
        return self.user_dao.delete_user(id)

    def query_users_by_course(self, course_id: str) -> list[UserResponse]:
        return self.user_dao.query_users_by_course(course_id)
    
    def find_user_by_id(self, id: str):
        return self.user_dao.find_user_by_id(id)
    
    def find_user_order_by_score(self, course_id: str):
        return self.user_dao.find_user_order_by_score(course_id)

    def login(self, user_login: UserLoginRequest) -> UserLoginResponse:
        user = self.find_user_by_id(user_login.id)
        if user and bcrypt.checkpw(user_login.password.encode('utf-8'), user["password"].encode('utf-8')):
            return UserLoginResponse(
                id=user["id"],
                name=user["name"],
                role=user["role"],
                gender=user["gender"],
            )
        return None

    def user_enroll(self, id: str, data: UserEnrollRequest) -> str:
        if validate_enrollment(data.enroll_type, data.enroll_id, id):
            if data.enroll_type == "COURSE":
                from api.services.courses import CourseService
                course_service = CourseService()
                enroll_data = CourseUpdateRequest(
                    action="ADD",
                    student=id,
                )
                course_service.update_course(data.enroll_id, enroll_data)
            elif data.enroll_type == "CLASS":
                from api.services.classes import ClassService
                class_service = ClassService()
                class_update = class_service.query_class_by_id(data.enroll_id)

                enroll_data = ClassUpdateRequest(
                    action="ADD",
                    student=id,
                )
                class_service.update_class(data.enroll_id, enroll_data)
            
            return self.user_dao.user_enroll(id, data)

    def score_update(self, class_id: str):
        class_data = self.class_service.query_class_by_id(class_id)
        score_data = self.score_service.query_score_by_class_id(class_id)

        student_ids = class_data.enrolled_students

        for user_id in student_ids:
            user_group = None

            for group_idx, group in enumerate(class_data.groups):
                for group_name, group_members in group.items():
                    if user_id in group_members:
                        user_group = group_name
                        break
                if user_group is not None:
                    break

            if user_group is None:
                raise HTTPException(status_code=404, detail=f"User {user_id} group not found in class data")

            total_score = 0
            for match in score_data.matches:
                for round in match.rounds:
                    total_score += round.scores.get(user_group, 0)

            update_data = UpdateUserScoreSchema(
                class_scores={class_id: total_score},
                total_score=total_score
            )

            self.user_dao.update_user_score(user_id,  update_data)

        return {"message": f"Scores updated for all students in class {class_id}"}







