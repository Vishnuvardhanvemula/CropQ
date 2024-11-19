# Import necessary libraries
from langchain_groq import ChatGroq  # type: ignore
from langchain_core.output_parsers import StrOutputParser  # type: ignore
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder  # type: ignore
from langchain.chains import create_history_aware_retriever, create_retrieval_chain  # type: ignore
from langchain.chains.combine_documents import create_stuff_documents_chain  # type: ignore
from langchain_core.documents import Document  # type: ignore
from typing import List
import os

# Import local utilities
from api.chroma_utils import vectorstore  # Assuming vectorstore is defined elsewhere in your code
from api.pydantic_models import ModelName  # Assuming ModelName is a class that defines the model names

# Load environment variables
from dotenv import load_dotenv  # type: ignore
load_dotenv()

# Configuration settings
groq_api_key = os.getenv('GROQ_API_KEY')

# Initialize the retriever and output parser
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
output_parser = StrOutputParser()


contextualize_q_system_prompt = (
    "You are an expert chatbot specializing in the agricultural domain. "
    "Your task is to answer questions related exclusively to agriculture, using the knowledge provided to you. "
    "Focus on topics such as crop management, soil health, plant diseases, pest control, irrigation, farming practices, "
    "agricultural technologies, and other related matters. "
    "Please restrict your responses to these areas only. "
    "If a question is outside the agricultural context or cannot be answered with the knowledge provided, respond with: "
    "'I can only assist with agriculture-related questions.'"
)

contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", contextualize_q_system_prompt),  
    MessagesPlaceholder("chat_history"),  
    ("human", "{input}")  
])

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant with expertise in agriculture. "
               "Use the following context from the agricultural knowledge base to answer the user's question. "
               "You are strictly limited to using only the data available in the custom knowledge base and cannot generate answers from any external sources and from internet."),
    ("system", "Context: {context}"),  
    MessagesPlaceholder(variable_name="chat_history"), 
    ("human", "{input}")  # User's current question or input
])


def get_rag_chain(model=ModelName, groq_api_key=groq_api_key, openai_api_key: str = None):
    # Initialize the language model
    llm = ChatGroq(model=model, groq_api_key=groq_api_key, api_key=openai_api_key,temperature = 0.3)
    
    # Create a history-aware retriever with the contextualization prompt
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    
    # Create a question-answering chain using the QA prompt
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    
    # Combine the retriever and QA chain into a RAG chain
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)    
    
    return rag_chain




