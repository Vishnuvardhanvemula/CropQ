from pydantic import BaseModel, Field # type: ignore
from enum import Enum
from datetime import datetime

class ModelName(str, Enum):
    llama3_70b_8192 = "llama3-70b-8192"
    llama_3_70b_versatile="llama-3.1-70b-versatile",
    mixtral_8x7b_32768 = "mixtral-8x7b-32768"
    Google = "gemma-7b-it"

class QueryInput(BaseModel):
    question: str
    session_id: str = Field(default=None)
    model: ModelName = Field(default=ModelName.llama3_70b_8192)

class QueryResponse(BaseModel):
    answer: str
    session_id: str
    model: ModelName

class DocumentInfo(BaseModel):
    id: int
    filename: str
    upload_timestamp: datetime

class DeleteFileRequest(BaseModel):
    file_id: int
