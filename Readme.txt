README.txt

PROJECT NAME: Disease Prediction Web App

PROJECT DETAILS:
This project is an AI + ML-based web application for disease prediction.
Users can input symptoms, and the app predicts possible diseases.
It includes features like:

AI chatbot for doctor-like consultation

Medical report storage and printing

User authentication (login, signup, etc.)

Integration with Gemini API for AI response

Web3Forms API for contact form

PostgreSQL database on Neon for storage

Deployment on Render
-------------------------------------------------------------------------------------
HOW TO CLONE AND FORK

Fork this repository to your GitHub account.
Clone it locally using:
git clone <repo-link>

Navigate into the project directory:
cd project-folder
-----------------------------------------------------------------------------------------------------
CREATE VIRTUAL ENVIRONMENT (Python)

Create virtual environment:
python -m venv .venv

Activate virtual environment:

On Windows:
.venv\Scripts\activate

On Mac/Linux:
source .venv/bin/activate

INSTALL REQUIRED PACKAGES

Install dependencies using requirements.txt:
pip install -r requirements.txt
-----------------------------------------------------------------------
GEMINI API SETUP

Go to Google AI Studio (https://aistudio.google.com/)

Generate your Gemini API key

Copy the key and add it to your project’s environment variables
Example (Windows):
set GEMINI_API_KEY=your_key_here
Example (Linux/Mac):
export GEMINI_API_KEY=your_key_here
---------------------------------------------------------------
WEB3FORM API SETUP

Visit https://web3forms.com/

Sign up and generate your API key
-------------------------------------------------------------------------
Replace the placeholder in project’s config file with your key

NEON POSTGRESQL DATABASE SETUP

Go to https://neon.tech/

Create a new PostgreSQL database

Note down:

Database name

User

Password

Host

Port

Update your project’s .env or config file with these details
-----------------------------------------------------------------------------
DEPLOYMENT ON RENDER

Go to https://render.com/

Create a new Web Service

Connect your GitHub repository

Select branch (main/master)
----------------------------------------------------------
Add environment variables:
GEMINI_API_KEY, DATABASE_URL

Render will automatically build and deploy your app

After deployment, open the given Render URL to access the app
-----------------------------------------------------------------------
END OF FILE