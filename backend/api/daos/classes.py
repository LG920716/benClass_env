from datetime import datetime, date
from api.database import db
from google.cloud import firestore
from api.schemas.classes import Class

class ClassDao:
    collection_name = "classes"

    from datetime import datetime

    def create_class(self, class_data: Class) -> Class:
        if isinstance(class_data.date, date):
            class_data.date = datetime(class_data.date.year, class_data.date.month, class_data.date.day)
        
        doc_ref = db.collection(self.collection_name).document(class_data.id).set(class_data.model_dump())
        
        return Class(**class_data.model_dump())

    def get_class_by_id(self, id: str) -> Class:
        doc_ref = db.collection(self.collection_name).document(id)
        doc = doc_ref.get()
        if doc.exists:
            return Class(**doc.to_dict())
        return None

    def update_class(self, id: str, class_data: Class):
        db.collection(self.collection_name).document(id).update({"enrolled_students": firestore.ArrayUnion(class_data["enrolled_students"])})
        return self.get_class_by_id(id)
    
    def grouping(self, id: str, grouped_data: list):
        db.collection(self.collection_name).document(id).update({
            "groups": grouped_data
        })
        return self.get_class_by_id(id)

    def delete_class(self, id: str):
        db.collection(self.collection_name).document(id).delete()
