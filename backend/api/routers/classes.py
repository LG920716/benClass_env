from fastapi import APIRouter, HTTPException
from api.services.classes import ClassService
from api.schemas.classes import Class, ClassCreateRequest, ClassUpdateRequest

router = APIRouter()
class_service = ClassService()

@router.post("", response_model=Class, tags=["classes"])
def create_class(class_data: ClassCreateRequest):
    return class_service.create_class(class_data)

@router.patch("/{id}", response_model=Class, tags=["classes"])
def update_class(id: str, class_update: ClassUpdateRequest):
    try:
        updated_class = class_service.update_class(id, class_update)
        return updated_class
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}", tags=["classes"])
def delete_class(id: str):
    return class_service.delete_class(id)

@router.get("/{id}", response_model=Class, tags=["classes"])
def query_class_by_id(id: str):
    return class_service.query_class_by_id(id)

@router.patch("/{id}/grouping", tags=["classes"])
def grouping(id: str):
    return class_service.grouping(id)