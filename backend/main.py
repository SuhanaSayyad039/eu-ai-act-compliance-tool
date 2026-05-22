from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import fria, cybersecurity, xai, bias, risk
from database import test_connection

app = FastAPI(
    title="EU AI Act Compliance Tool",
    description="Automated FRIA, Cybersecurity, XAI, Risk Scoring and Bias Detection for High-Risk Credit Scoring AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fria.router, prefix="/api/fria", tags=["FRIA"])
app.include_router(cybersecurity.router, prefix="/api/cybersecurity", tags=["Cybersecurity"])
app.include_router(xai.router, prefix="/api/xai", tags=["XAI"])
app.include_router(bias.router, prefix="/api/bias", tags=["Bias Detection"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Scoring"])

@app.on_event("startup")
async def startup_event():
    print("Starting EU AI Act Compliance Tool API...")
    test_connection()

@app.get("/")
async def root():
    return {
        "message": "EU AI Act Compliance Tool API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}