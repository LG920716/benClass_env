from fastapi import APIRouter, Body, HTTPException
from api.schemas.users import UserCreateRequest, UserUpdateRequest, UserLoginRequest, UserLoginResponse, UserResponse, UserEnrollRequest
from api.services.users import UserService

router = APIRouter()
user_service = UserService()

@router.post("/register", response_model=UserResponse, tags=["user"])
def register(user_register: UserCreateRequest = Body(...)):
    return user_service.register(user_register)

@router.patch("/update/{id}", response_model=UserResponse, tags=["user"])
def update_user(id: str, user_update: UserUpdateRequest = Body(...)):
    return user_service.update_user(id, user_update)

@router.delete("/delete/{id}", tags=["user"])
def delete_user(id: str) -> str:
    return user_service.delete_user(id)

@router.get("/query/{course_id}", response_model=list[UserResponse], tags=["user"])
def query_users(course_id: str):
    return user_service.query_users_by_course(course_id)

@router.get("/{id}", response_model=UserResponse, tags=["user"])
def find_user_by_id(id:str):
    return user_service.find_user_by_id(id)

@router.get("/{course_id}/score", response_model=list[UserResponse], tags=["user"])
def find_user_order_by_score(course_id:str):
    return user_service.find_user_order_by_score(course_id)

@router.post("/login", response_model=UserLoginResponse, tags=["user"])
def login(user_login: UserLoginRequest = Body(...)):
    user = user_service.login(user_login)
    if user:
        return user
    raise HTTPException(status_code=400, detail="Invalid credentials")

@router.patch("/{id}/enroll", response_model=UserResponse, tags=["user"])
def user_enroll(id: str, data: UserEnrollRequest):
    return user_service.user_enroll(id, data)

@router.patch("/score_update/{class_id}", tags=["user"])
def score_update(class_id: str) -> str:
    return user_service.score_update(class_id)