# AI Secure Data Intelligence Platform 🛡️

A production-ready full-stack application that acts as a secure data intelligence system. It analyzes logs, texts, and source code files to detect exposed secrets, PII, and security risks using an advanced regex engine, and provides automated AI security insights via OpenAI.

## Features ✨

- **Data Leak Detection**: Automatically identifies Emails, Passwords, API Keys, JWTs, and IP Addresses in uploaded logs.
- **Risk Assessment**: Assigns severity scores (Low, Medium, High, Critical) based on the type of exposed data.
- **AI Insights**: Integrates with OpenAI to provide automated security recommendations and posture summaries.
- **Data Masking**: Toggleable masking to hide exact values of exposed credentials in the UI.
- **Modern UI**: Stunning, responsive React frontend powered by Tailwind CSS and Lucide icons.
- **Secure Backend**: Built with FastAPI, designed for performance and modularity.

## Tech Stack 💻

- **Frontend**: React, Vite, Tailwind CSS v3, Axios, Lucide React
- **Backend**: Python 3, FastAPI, Uvicorn, OpenAI SDK, Pydantic
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## Getting Started 🚀

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API Key: `OPENAI_API_KEY=your_key_here`
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at the URL provided by Vite (usually `http://localhost:5173`)*

---

## API Documentation 📚

Once the backend is running, you can access the interactive API documentation provided by Swagger UI:
- **Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Endpoint: `/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: File (`.log` or `.txt`)

---

## Deployment 🌍

### Deploying Backend to Render
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add your `OPENAI_API_KEY` to the Environment Variables.

### Deploying Frontend to Vercel
1. Create a new Project on Vercel.
2. Connect your GitHub repository.
3. Set the Root Directory to `frontend`.
4. The Build & Development Settings will be automatically detected (Vite).
5. Deploy!
*(Ensure you update the API URL in `frontend/src/components/FileUpload.jsx` to point to your live Render backend URL before deploying)*

---


