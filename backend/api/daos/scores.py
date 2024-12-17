from api.database import db
from api.schemas.scores import ScoreResponse, ScoreUpdateRequest

class ScoreDao:
    collection_name = "scores"

    def create_score(self, score_data: dict) -> ScoreResponse:
        doc_ref = db.collection(self.collection_name).document()
        doc_ref.set(score_data)
        return ScoreResponse(**score_data)

    def get_score_by_class_id(self, class_id: str) -> ScoreResponse:
        docs = db.collection(self.collection_name).where("class_id", "==", class_id).stream()
        scores = []
        for doc in docs:
            scores.append(doc.to_dict())
        if scores:
            return ScoreResponse(**scores[0])
        return None

    def update_scores(self, class_id: str, score_data: ScoreUpdateRequest):
        docs = db.collection(self.collection_name).where("class_id", "==", class_id).stream()
        for doc in docs:
            doc_ref = doc.reference
            doc_ref.set(score_data.model_dump())
            return 

        raise Exception(f"Scores for class ID {class_id} not found")

    def delete_score(self, class_id: str):
        docs = db.collection(self.collection_name).where("class_id", "==", class_id).stream()
        for doc in docs:
            doc.reference.delete()
        return f"Scores for class ID {class_id} have been successfully deleted."  # 返回成功消息
