from datetime import datetime

from fastapi import APIRouter

from api.schemas.health import HealthcheckResponse

router = APIRouter()

@router.get("/healthcheck", response_model=HealthcheckResponse)
def healthcheck() -> HealthcheckResponse:
    message = "healthy"
    return HealthcheckResponse(
        message=message,
        time=datetime.now(),
    )