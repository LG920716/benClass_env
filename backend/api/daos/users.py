import bcrypt
from api.database import db
from api.schemas.users import UpdateUserScoreSchema, UserCreateRequest, UserUpdateRequest, UserResponse, UserEnrollRequest

class UserDao:
    collection_name = "users"

    def register(self, user_register: UserCreateRequest) -> UserResponse:
        hashed_password = bcrypt.hashpw(user_register.password.encode('utf-8'), bcrypt.gensalt())
        new_user = {
            "id": user_register.id,
            "name": user_register.name,
            "password": hashed_password.decode('utf-8'),
            "role": user_register.role,
            "gender": user_register.gender,
            "courses_enrolled": [],
            "classes_enrolled": [],
            "class_scores": {},
            "total_score": 0
        }
        db.collection(self.collection_name).document(new_user["id"]).set(new_user)
        return self.get(new_user["id"])
    
    def get(self, user_id: str) -> UserResponse:
        doc_ref = db.collection(self.collection_name).document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            return UserResponse(**doc.to_dict())
        raise Exception(f"User with ID {user_id} not found")

    def update_user(self, id: str, user_update: UserUpdateRequest) -> UserResponse:
        update_data = user_update.model_dump(exclude_unset=True)
        db.collection(self.collection_name).document(id).update(update_data)
        return self.get(id)
    
    def update_user_score(self, user_id: str, update_data: UpdateUserScoreSchema):
        user_ref = db.collection("users").document(user_id)
        
        user_doc = user_ref.get()
        if not user_doc.exists:
            raise ValueError(f"User with id {user_id} not found")
        
        updates = {
            "class_scores": update_data.class_scores,
            "total_score": update_data.total_score
        }
    
        user_ref.update(updates)

        updated_user = self.find_user_by_id(user_id)
        return updated_user

    def delete_user(self, id: str) -> str:
        doc_ref = db.collection(self.collection_name).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_ref.delete()
            return f"User with ID {id} has been successfully deleted."
        return f"User with ID {id} not found."

    def query_users_by_course(self, course_id: str) -> list[UserResponse]:
        users = db.collection(self.collection_name).where("courses_enrolled", "array_contains", course_id).stream()
        return [UserResponse(**user.to_dict()) for user in users]

    def find_user_by_id(self, user_id: str):
        doc_ref = db.collection(self.collection_name).document(user_id).get()
        if doc_ref.exists:
            return doc_ref.to_dict()
        return None
    
    def find_user_order_by_score(self, course_id: str) -> list[UserResponse]:
        query = (
            db.collection(self.collection_name)
            .where("courses_enrolled", "array_contains", course_id)
            .order_by("total_score", direction="DESCENDING")
        )
        
        result = list(query.stream())
        
        users = [UserResponse(**doc.to_dict()) for doc in result]
        
        return users
    
    def user_enroll(self, id: str, data: UserEnrollRequest) -> UserResponse:
        user_ref = db.collection(self.collection_name).document(id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise Exception(f"User with ID {id} not found")

        user_data = user_doc.to_dict()

        if data.enroll_type == "COURSE":
            courses_enrolled = user_data.get("courses_enrolled", [])
            if isinstance(courses_enrolled, str):
                courses_enrolled = [courses_enrolled]

            if data.enroll_id not in courses_enrolled:
                courses_enrolled.append(data.enroll_id)
                user_data["courses_enrolled"] = courses_enrolled
                user_ref.update({"courses_enrolled": courses_enrolled})

        elif data.enroll_type == "CLASS":
            classes_enrolled = user_data.get("classes_enrolled", [])
            if isinstance(classes_enrolled, str):
                classes_enrolled = [classes_enrolled]

            if data.enroll_id not in classes_enrolled:
                classes_enrolled.append(data.enroll_id)
                user_data["classes_enrolled"] = classes_enrolled
                user_ref.update({"classes_enrolled": classes_enrolled})

        return UserResponse(**user_ref.get().to_dict())
