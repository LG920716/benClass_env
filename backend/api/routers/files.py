from fastapi import APIRouter, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter(tags=["file"])

@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    contents = await file.read()
    #"wb" means write binary
    with open(f"static/{file.filename}", "wb") as f:
        f.write(contents)
    return JSONResponse(content={"filename": file.filename})