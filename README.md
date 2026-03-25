# Ask-Docs: Enterprise-Grade RAG Platform

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_&_pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

## Introduction
**Ask-Docs** is an AI-powered document analysis platform designed for performance and scale. It allows users to upload confidential PDF documents and extract specific statistical insights through a conversational interface. Built to run on Ubuntu Linux infrastructure, it utilizes native PostgreSQL vector capabilities to guarantee fast and optimized semantic searches without relying on expensive third-party vector stores.

## 📸 Demo
*(Demonstration querying statistical data from official reports)*
![Ask-Docs Demo](./public/tutorial-ask-docs.gif)

## Key Features (Engineering Focus)
- **Advanced RAG Pipeline:** Utilizes LangChain to chunk, embed, and query document data with high semantic accuracy via `pgvector`.
- **Enterprise Infrastructure:** Designed for deployment on Ubuntu Linux servers, ensuring high performance, security, and custom environment control.
- **Native Vector Database:** Seamless integration with PostgreSQL and the `pgvector` extension for rapid similarity searches directly alongside relational data.
- **Modern UI/UX:** Fully responsive, accessible, and type-safe interface built with Tailwind CSS, shadcn/ui, and React Server Components.
- **Markdown Rendering:** Native support for formatting AI responses (bolding, lists, code blocks) using `react-markdown`.

## Tech Stack
* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Radix UI.
* **Backend:** Node.js, Next.js Server Actions.
* **AI & Data Processing:** LangChain (JS/TS), OpenAI/Gemini API.
* **Database & Infrastructure:** PostgreSQL, pgvector extension, Ubuntu Linux Server, Google Cloud Platform (GCP).

## Database Architecture
The application relies on a relational database design using raw SQL for maximum performance and explicit schema definition:
1. `documents` (pgvector): Stores document metadata, text chunks, and vector embeddings, indexed for rapid semantic similarity search.
2. `messages`: Stores conversation history for the AI assistant context.

## Getting Started

### 1. Prerequisites
- Node.js (v18.17+)
- A PostgreSQL database with the `pgvector` extension enabled.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone [https://github.com/nicolas097/ask-docs-platform.git](https://github.com/nicolas097/ask-docs-platform.git)
cd ask-docs-platform/ask-docs
npm install