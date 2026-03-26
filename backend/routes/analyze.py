from fastapi import APIRouter, UploadFile, File, HTTPException
from models import AnalysisResult
from services.analyzer import analyze_file_content

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_log(file: UploadFile = File(...)):
    if not file.filename.endswith(('.log', '.txt')):
        raise HTTPException(status_code=400, detail="Only .log and .txt files are supported.")
        
    try:
        content = await file.read()
        text_content = content.decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file. Ensure it is valid text/utf-8 encoded. Error: {str(e)}")
        
    result = analyze_file_content(text_content)
    return result
