from api.database import db
from api.schemas.courses import CourseResponse

class CourseDao:
    collection_name = "courses"

    def create_course(self, course_data: dict) -> CourseResponse:
        db.collection(self.collection_name).document(course_data["id"]).set(course_data)
        return CourseResponse(**course_data)

    def get_course_by_id(self, course_id: str) -> CourseResponse:
        doc_ref = db.collection(self.collection_name).document(course_id)
        doc = doc_ref.get()

        if doc.exists:
            return CourseResponse(**doc.to_dict())
        return None
    
    def get_courses_by_teacher(self, teacher_name: str) -> list[dict[str, any]]:
        courses_ref = db.collection("courses").where("teacher_name", "==", teacher_name)
        docs = courses_ref.stream()
        
        courses = [
            {
                "id": doc.id,
                **doc.to_dict()
            }
            for doc in docs
        ]
        
        return courses

    def update_course(self, course_id: str, course_data: dict):
        doc_ref = db.collection(self.collection_name).document(course_id)
        doc_ref.update(course_data)

    def delete_course(self, course_id: str):
        db.collection(self.collection_name).document(course_id).delete()