# Syllabus AI: Project Report

## Overview
**Syllabus AI** is a modern web application designed to help students transform their study materials (like course syllabuses and lecture notes) into interactive study tools. By leveraging Retrieval-Augmented Generation (RAG), the app allows users to "chat" with their documents and automatically generate summaries and flashcards.

---

## Technical Architecture

### 1. Ingestion Workflow
When a user uploads a PDF document:
- **Parsing**: The file is processed using `pdf-parse` to extract raw text content.
- **Chunking**: The text is split into manageable chunks (approximately 1000 characters each) to maintain context while staying within token limits.
- **Embedding**: Each chunk is converted into a numerical vector using the `sentence-transformers/all-MiniLM-L6-v2` model via **Hugging Face**.
- **Vector Storage**: These vectors, along with the original text as metadata, are stored in **Pinecone**, a specialized vector database.

### 2. Retrieval-Augmented Generation (RAG)
When a user interacts with the system:
- **Chat**: The user's query is converted into an embedding. The system searches Pinecone for the most relevant text chunks based on vector similarity. This context is then sent to **Groq (Llama 3)** to generate a precise, context-aware answer.
- **Study Materials**: The system retrieves the most relevant content from the user's stored documents and prompts the AI to format it into structured summaries or "Front | Back" flashcards.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Vector Database** | [Pinecone](https://www.pinecone.io/) |
| **AI Inference** | [Groq](https://groq.com/) (Llama 3.1 8B) |
| **Embeddings** | [Hugging Face](https://huggingface.co/) (`all-MiniLM-L6-v2`) |
| **PDF Processing** | `pdf-parse` |
| **Icons** | Lucide React |

---

## Key Features
- **PDF Upload & Ingestion**: Seamlessly process educational documents.
- **Smart Chat**: Ask questions directly about the syllabus and get cited answers.
- **AI Flashcards**: Automatically generate question-and-answer pairs for active recall.
- **High-Level Summaries**: Distill long documents into key concepts and bullet points.
- **Multi-User Isolation**: Secure data handling ensuring users only access their own uploaded materials.
- **Dark Mode Support**: A premium UI built for long study sessions.

---

## Project Structure
- `src/app/`: Contains the frontend routes and API endpoints (`chat`, `generate`, `ingest`).
- `src/services/`: Core business logic for PDF processing and AI interactions.
- `src/components/`: Reusable UI elements like the Sidebar, Navbar, and Footer.
- `src/lib/`: Unified configuration for external services like Pinecone.

---

## Implementation Status
The project is built on a robust foundation using state-of-the-art AI tooling. The integration of Groq ensures exceptionally low latency for AI responses, while Pinecone provides efficient retrieval for large volumes of study material.