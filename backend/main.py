import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analyze
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Secure Data Intelligence Platform",
    description="API for analyzing log files for sensitive data and generating AI insights.",
    version="1.0.0"
)

# CORS configuration - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analyze.router, tags=["Analysis"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Secure Data Intelligence API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
