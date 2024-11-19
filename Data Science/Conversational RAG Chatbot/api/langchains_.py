from langchain_groq import ChatGroq  # type: ignore
from langchain_core.output_parsers import StrOutputParser  # type: ignore
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder  # type: ignore
from langchain.chains import create_history_aware_retriever, create_retrieval_chain  # type: ignore
from langchain.chains.combine_documents import create_stuff_documents_chain  # type: ignore
from api.chroma_utils import vectorstore
from api.pydantic_models import ModelName
from dotenv import load_dotenv  # type: ignore
import os

# Load environment variables
load_dotenv()

# Initialize constants
groq_api_key = os.environ["GROQ_API_KEY"]
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
output_parser = StrOutputParser()

def get_rag_chain(model: ModelName, groq_api_key: str = groq_api_key, openai_api_key: str = None):
    """
    Create a Retrieval-Augmented Generation (RAG) chain for question answering.

    Args:
        model (ModelName): Model to be used for question answering.
        groq_api_key (str): API key for Groq.
        openai_api_key (str): Optional API key for OpenAI.

    Returns:
        Chain: A Retrieval-Augmented Generation (RAG) chain.
    """
    
    # Define the contextualize question system prompt
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    # Define the answer question system prompt
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "'I can only assist with agriculture-related questions.'"
        " Use three sentences maximum and keep the "
        "answer concise."
        "\n\n"
        "{context}"
    )
    
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    # Initialize the language model
    llm = ChatGroq(model=model, groq_api_key=groq_api_key, api_key=openai_api_key, temperature=0.3)
    
    # Create a history-aware retriever using the contextualization prompt
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    
    # Create a question-answering chain using the QA prompt
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    
    # Combine the retriever and QA chain into a RAG chain
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    return rag_chain
