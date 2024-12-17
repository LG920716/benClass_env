from random import random
from random import shuffle
from fastapi import HTTPException
from api.daos.scores import ScoreDao
from api.schemas.scores import RoundUpdate, ScoreCreateRequest, ScoreUpdateRequest, ScoreResponse, MatchUpdate

class ScoreService:
    def __init__(self):
        self.score_dao = ScoreDao()

    def create_score(self, score_request: ScoreCreateRequest) -> ScoreResponse:
        score_data = {
            "class_id": score_request.class_id,
            "matches": [match.model_dump() for match in score_request.matches]
        }
        return self.score_dao.create_score(score_data)

    def update_score(self, class_id: str, score_update: ScoreUpdateRequest) -> ScoreResponse:
        existing_scores = self.score_dao.get_score_by_class_id(class_id)

        if not existing_scores:
            raise HTTPException(status_code=404, detail=f"Scores for class ID {class_id} not found")

        existing_scores.matches = score_update.matches

        self.score_dao.update_scores(class_id, existing_scores)
        return ScoreResponse(**existing_scores.model_dump())

    def delete_score(self, class_id: str) -> str:
        if not self.score_dao.get_score_by_class_id(class_id):
            raise HTTPException(status_code=404, detail=f"Score with class ID {class_id} not found")

        self.score_dao.delete_score(class_id)
        return f"Scores for class ID {class_id} have been successfully deleted."

    def query_score_by_class_id(self, class_id: str) -> ScoreResponse:
        score = self.score_dao.get_score_by_class_id(class_id)
        if not score:
            raise HTTPException(status_code=404, detail=f"Score with class ID {class_id} not found")
        return ScoreResponse(**score.model_dump())
    
    def schedule(self, class_id: str) -> ScoreResponse:
        from api.services.classes import ClassService
        class_service = ClassService()

        score_data = self.query_score_by_class_id(class_id)
        class_data = class_service.query_class_by_id(class_id)
        teams = class_data.groups

        team_list = []
        for group in teams:
            for team_name, members in group.items():
                team_list.append({"team_name": team_name, "members": members})

        shuffle(team_list)

        total_teams = len(team_list)
        matches = []
        match_number = 1

        num_matches = 4

        if total_teams <= 3:
            rounds_per_match = 1
        elif total_teams <= 5:
            rounds_per_match = 2
        elif total_teams < 8:
            rounds_per_match = 3
        else:
            rounds_per_match = 4

        for match_index in range(num_matches):
            match = {
                "match_number": match_number,
                "rounds": []
            }

            for round_index in range(rounds_per_match):
                team1 = team_list[(match_index + round_index) % total_teams]
                team2 = team_list[(match_index + round_index + 1) % total_teams]

                round_update = RoundUpdate(
                    round_number=round_index + 1,
                    scores={team1["team_name"]: 0, team2["team_name"]: 0}
                )
                match["rounds"].append(round_update)

            matches.append(MatchUpdate(**match))
            match_number += 1

        score_data.matches = matches
        return self.score_dao.update_scores(class_id, score_data)