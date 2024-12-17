from pydantic import BaseModel
from typing import List

class CourseCreateRequest(BaseModel):
    course_name: str
    teacher_name: str

class CourseUpdateRequest(BaseModel):
    action: str  # ADD, DELETE, UPDATE
    student: str = None
    students: List[str] = []
    classes: List[str] = []
    course_name: str = None
    teacher_name: str = None

class CourseResponse(BaseModel):
    id: str
    course_name: str
    teacher_name: str
    students: list = []
    classes: list = []