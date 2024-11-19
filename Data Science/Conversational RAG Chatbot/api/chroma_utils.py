# Import necessary libraries
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, UnstructuredHTMLLoader # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings # type: ignore
from langchain_huggingface import HuggingFaceEmbeddings # type: ignore
from langchain_chroma import Chroma # type: ignore
from langchain_core.documents import Document # type: ignore
import os
from typing import List

# Initialize the text splitter, embedding function, and Chroma vector store
text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=200, length_function=len)
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embedding_function)

# Document Loading and Splitting Functions
def load_and_split_document(file_path: str) -> List[Document]:
    """
    Loads a document (PDF, DOCX, or HTML) and splits it into smaller chunks.

    Args:
        file_path (str): The path to the document file.

    Returns:
        List[Document]: A list of Document objects, each representing a chunk of the original document.
    """
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith('.docx'):
        loader = Docx2txtLoader(file_path)
    elif file_path.endswith('.html'):
        loader = UnstructuredHTMLLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")
    
    documents = loader.load()
    return text_splitter.split_documents(documents)

# Chroma Indexing Functions
def index_document_to_chroma(file_path: str, file_id: int) -> bool:
    """
    Loads, splits, and indexes a document into Chroma vector store with metadata.

    Args:
        file_path (str): The path to the document file.
        file_id (int): A unique identifier for the document to add as metadata.

    Returns:
        bool: True if the document was successfully indexed, False otherwise.
    """
    try:
        # Load and split the document
        splits = load_and_split_document(file_path)
        
        # Add metadata to each split (e.g., file_id)
        for split in splits:
            split.metadata['file_id'] = file_id
        
        # Add documents to Chroma
        vectorstore.add_documents(splits)
        return True
    except Exception as e:
        print(f"Error indexing document: {e}")
        return False

def delete_doc_from_chroma(file_id: int) -> bool:
    """
    Deletes all document chunks associated with the given file_id from Chroma.

    Args:
        file_id (int): The unique identifier of the documents to delete.

    Returns:
        bool: True if the documents were successfully deleted, False otherwise.
    """
    try:
        # Retrieve documents by file_id
        docs = vectorstore.get(where={"file_id": file_id})
        print(f"Found {len(docs['ids'])} document chunks for file_id {file_id}")
        
        # Delete documents by file_id
        vectorstore._collection.delete(where={"file_id": file_id})
        print(f"Deleted all documents with file_id {file_id}")
        
        return True
    except Exception as e:
        print(f"Error deleting document with file_id {file_id} from Chroma: {str(e)}")
        return False


