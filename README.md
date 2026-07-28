# AI Resume Screening & Applicant Matching System

An intelligent, full-stack HR tech application powered by **Google Gemini 1.5/2.0 AI** that automates candidate resume screening, skill gap analysis, applicant ranking, side-by-side comparison matrix, and customized interview question generation.

---

## 🌟 Key Features

- **PDF & Document Resume Upload**: Drag-and-drop or select `.pdf`, `.docx`, or `.txt` resume files. Gemini AI extracts candidate skills, experience, and education directly from the uploaded document.
- **Automated Resume Parsing & Screening**: Paste raw resume text, upload PDF documents, or load sample candidate profiles to instantly screen applicants.
- **AI Match Scoring**: Calculates an objective 0–100 match score and categorizes candidates into **Strong Fit**, **Potential Fit**, or **Unsuitable**.
- **Skill Gap & Verification Analysis**: Highlights matched required skills vs. critical missing skills for any target job description.
- **AI-Generated Interview Questions**: Automatically creates tailored technical and behavioral interview questions to probe candidate weak spots.
- **Side-by-Side Candidate Comparison**: Select multiple candidate profiles to generate an executive comparative matrix with top recommendations.
- **Automated Email Outreach**: Generates ready-to-copy interview invitation and respectful rejection email drafts.
- **Analytics Dashboard**: Visualizes applicant fit distribution, average match scores, and overall skill shortage trends across the candidate pool.
- **AI Job Description Generator**: Generate structured job requirements directly using Gemini prompts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, tsx
- **AI Engine**: `@google/genai` (Gemini API)
- **Bundler & Build**: Vite, Esbuild

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Gemini API Key (Set in `.env`)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/ai-resume-screening.git
   cd ai-resume-screening
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deploying to Render

If you are deploying this repository to **Render.com**, make sure to set the **Environment** to **Node** (not Python):

1. **Environment**: `Node`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Add `GEMINI_API_KEY` under Environment Variables in Render Dashboard.

> **Note**: A `render.yaml` blueprint configuration file is included in this repository to automatically configure the Node.js runtime on Render and avoid Python `requirements.txt` errors.

---

## 📄 License

Apache License 2.0
