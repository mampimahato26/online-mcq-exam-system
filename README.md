# Online MCQ Exam System

🔗 **[Live Demo](https://online-mcq-exam-system-beta.vercel.app/)**

A secure, fully functional, and clean full-stack academic web application designed for colleges. It enables examiners to create timed multiple-choice exams (exactly 10 questions) and students to attempt tests with automated grading and countdown auto-submission features. System administrators can audit all users, exams, and grades.
---


## Technology Stack

* **Frontend**: React.js, Vite, JavaScript, CSS, HTML5
* **Backend**: Node.js, Express.js (REST APIs)
* **Database**: MySQL Server
* **Authentication**: JSON Web Tokens (JWT) & bcrypt password hashing

---

## Client-Server Architecture

This application employs a strict **Client-Server Architecture**:

```
      +-------------------------------------------+
      |               React Client                |
      |          (Vite Frontend on Port 5173)     |
      +---------------------+---------------------+
                            |
                     REST API (HTTP)
                            |
                            v
      +---------------------+---------------------+
      |               Express Server              |
      |          (Node Backend on Port 5000)      |
      +---------------------+---------------------+
                            |
                    mysql2 Connection
                            |
                            v
      +---------------------+---------------------+
      |               MySQL Database              |
      |          (mcq_exam_system on Port 3306)   |
      +-------------------------------------------+
```

1. **Client (React)**: Fetches and displays exams, manages local states (such as active selections and remaining time), and sends user responses.
2. **Server (Express.js)**: Enforces role guards, verifies authentication tokens, manages database operations, strips correct answers from student endpoints, and evaluates final scores.
3. **Database (MySQL)**: Retains records of users, exam structures, MCQs, and results with active foreign key relationships.

---

## Database Explanation

The relational structure consists of four main tables inside the `mcq_exam_system` database:
* **`users`**: Contains credential info, password hashes, and user roles (`student`, `examiner`, `admin`).
* **`exams`**: Metadata records for tests created by examiners containing duration details.
* **`questions`**: Strictly 10 multiple-choice questions per exam. Contains the options and the correct answer.
* **`results`**: Grade records containing correct/wrong metrics and percentages.

---

## Installation & Setup Instructions

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed (v16+)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) installed and running locally on port 3306

### 2. Configure the MySQL Database
1. Open your local MySQL Command Line Client, Workbench, or terminal.
2. Run the SQL schema script located in `database/schema.sql`:
   ```sql
   SOURCE c:/Users/MAMPI MAHATO/OneDrive/Desktop/Online MCQ Exam System/database/schema.sql;
   ```
   *Alternatively, create a database named `mcq_exam_system` and copy-paste the queries inside `database/schema.sql`.*

### 3. Setup the Backend Server
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   copy .env.example .env
   ```
3. Open the `.env` file and configure your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=mcq_exam_system
   JWT_SECRET=mcq_exam_system_secret_key_2026
   ```
4. Install backend node packages:
   ```bash
   npm install
   ```

### 4. Setup the Frontend Client
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install client node packages:
   ```bash
   npm install
   ```

---

## Running the Application

### Start the Express Backend Server
From the `server/` folder:
```bash
npm run dev
```
*The server will start on [http://localhost:5000](http://localhost:5000).*

### Start the React Frontend App
From the `client/` folder:
```bash
npm run dev
```
*The Vite development server will host the frontend on [http://localhost:5173](http://localhost:5173).*

---

## Sample Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@exam.com` | `admin123` |
| **Course Examiner** | `examiner@exam.com` | `examiner123` |
| **College Student** | `student@exam.com` | `student123` |

---

## Project Workflow

### 1. Examiner Workflow
1. Log in with Examiner credentials.
2. Click **Create Exam** and configure the title and time limit.
3. The page transitions directly to the **Set MCQ Questions** editor.
4. Input exactly 10 questions with options (A, B, C, D) and select the correct option.
5. Click **Save Exam** to persist questions.

### 2. Student Workflow
1. Register a new account or log in with Student credentials.
2. Go to **Available Exams** and click **Start Exam** on a active test.
3. Review regulations on the instructions screen, check the agree box, and click **Begin Exam Attempt**.
4. Solve the questions. Toggle selections, navigate back and forth, or jump using the right navigation panel.
5. Watch the countdown timer. If the timer reaches `00:00`, the exam submits automatically.
6. Alternatively, click **Submit Exam** on the final question and confirm.
7. Instantly view your score percentage, correct answers, and error metrics on the results page.

### 3. Admin Workflow
1. Log in with Admin credentials.
2. Review statistics cards detailing total users and exams in the system.
3. Manage examiners and students: create accounts or delete them.
4. View exams active in the system or audit student transcripts in the results view.
