import os
import uuid
import logging
import shutil
import warnings
from fastapi import FastAPI, File, UploadFile, HTTPException  # type: ignore
from api.pydantic_models import ModelName, QueryInput, QueryResponse, DocumentInfo, DeleteFileRequest
from api.langchains_ import get_rag_chain
from api.database_utils import (
    insert_application_logs,
    get_chat_history,
    get_all_documents,
    insert_document_record,
    delete_document_record
)
from api.chroma_utils import index_document_to_chroma, delete_doc_from_chroma

# -------------------- Ignore Warnings --------------------
warnings.filterwarnings("ignore", category=DeprecationWarning)


# -------------------- Configuration --------------------

# Set up logging
logging.basicConfig(filename="app.log", level=logging.INFO)

# Initialize FastAPI app
app = FastAPI()

# -------------------- Constants --------------------

ALLOWED_EXTENSIONS = [".pdf", ".docx", ".html"]


@app.post("/")
def root():
    return {"message": "Welcome to the Conversational RAG Chatbot"}

@app.post("/favicon.ico")
def favicon():
    return {"message": "No favicon found"}

# -------------------- Chat Endpoint --------------------

@app.post("/chat", response_model=QueryResponse)
def chat(query_input: QueryInput) -> QueryResponse:
    """
    Handles user queries by leveraging the RAG (Retrieval-Augmented Generation) chain.

    Args:
        query_input (QueryInput): Input data including session ID, question, and model choice.

    Returns:
        QueryResponse: AI's response and session ID.
    """
    session_id = query_input.session_id or str(uuid.uuid4())
    logging.info(f"Session ID: {session_id}, User Query: {query_input.question}, Model: {query_input.model.value}")

    # Retrieve chat history and process the query
    chat_history = get_chat_history(session_id)
    rag_chain = get_rag_chain(query_input.model.value)
    answer = rag_chain.invoke({
        "input": query_input.question,
        "chat_history": chat_history
    })["answer"]

    # Log the interaction and return the response
    insert_application_logs(session_id, query_input.question, answer, query_input.model.value)
    logging.info(f"Session ID: {session_id}, AI Response: {answer}")
    return QueryResponse(answer=answer, session_id=session_id, model=query_input.model)

# -------------------- Document Upload Endpoint --------------------

@app.post("/upload-doc")
def upload_and_index_document(file: UploadFile = File(...)) -> dict:
    """
    Uploads and indexes a document into the Chroma database.

    Args:
        file (UploadFile): File to be uploaded.

    Returns:
        dict: Success message and file ID.
    """
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed types are: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Insert document record and index to Chroma
        file_id = insert_document_record(file.filename)
        success = index_document_to_chroma(temp_file_path, file_id)

        if success:
            return {"message": f"File {file.filename} has been successfully uploaded and indexed.", "file_id": file_id}
        else:
            delete_document_record(file_id)
            raise HTTPException(status_code=500, detail=f"Failed to index {file.filename}.")
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# -------------------- Document List Endpoint --------------------

@app.get("/list-docs", response_model=list[DocumentInfo])
def list_documents() -> list[DocumentInfo]:
    """
    Lists all uploaded documents with metadata.

    Returns:
        list[DocumentInfo]: List of document information.
    """
    return get_all_documents()

# -------------------- Document Delete Endpoint --------------------

@app.post("/delete-doc")
def delete_document(request: DeleteFileRequest) -> dict:
    """
    Deletes a document from the system (Chroma and database).

    Args:
        request (DeleteFileRequest): File ID to be deleted.

    Returns:
        dict: Success or error message.
    """
    # Delete from Chroma
    chroma_delete_success = delete_doc_from_chroma(request.file_id)
    if chroma_delete_success:
        # Delete from database
        db_delete_success = delete_document_record(request.file_id)
        if db_delete_success:
            return {"message": f"Successfully deleted document with file_id {request.file_id} from the system."}
        else:
            return {
                "error": f"Deleted from Chroma but failed to delete document with file_id {request.file_id} from the database."
            }
    else:
        return {"error": f"Failed to delete document with file_id {request.file_id} from Chroma."}
