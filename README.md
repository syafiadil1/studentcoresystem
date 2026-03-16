# StudentCore

StudentCore is a personal academic organizer built for university students to manage academic life in one place. It helps track courses, timetable, tasks, assessments, and course files through a single web app.

## Features

- Manage courses by semester
- Track weekly timetable and class sessions
- Organize tasks and to-do items
- Manage homework, assignments, quizzes, tests, exams, and presentations
- Upload and store course files locally
- View deadlines and upcoming academic work from one dashboard

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma Client
- SQLite
- Tailwind CSS

## Getting Started

Install dependencies and prepare the local database:

```bash
npm install
npm run db:setup
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:setup
```

## Notes

- Course file uploads are stored locally in `storage/uploads`
- Demo academic data is added during database setup
- This MVP is designed for a single student workspace
