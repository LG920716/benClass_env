from pydantic import BaseModel
from typing import Optional
from datetime import date

class Class(BaseModel):
    id: str
    course_id: str
    date: date
    enrolled_students: list = []
    groups: list[dict[str, list[str]]] = []

class ClassCreateRequest(BaseModel):
    course_id: str
    date: date
    
class ClassUpdateRequest(BaseModel):
    action: str  # ADD, DELETE, UPDATE
    student: str = None
    students: list[str] = []