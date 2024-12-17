from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users, courses, classes, scores, health, files

app = FastAPI()

origins = [
    "http://localhost:3000",
]

# CORS 設置
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# 註冊路由
app.include_router(users.router, prefix="/users")
app.include_router(courses.router, prefix="/courses")
app.include_router(classes.router, prefix="/classes")
app.include_router(scores.router, prefix="/scores")
app.include_router(health.router)
app.include_router(files.router)