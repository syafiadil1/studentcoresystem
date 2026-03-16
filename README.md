## StudentCore

StudentCore is a personal academic organizer for university students. It combines courses, timetable, files, tasks, and assessments in one web app.

## Getting Started

Install dependencies and prepare the local database:

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stack

- Next.js App Router
- TypeScript
- Prisma Client
- SQLite
- Local file storage for course materials

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:setup
```

## Notes

- Course file uploads are stored locally in `storage/uploads`.
- Demo academic data is inserted by `npm run db:setup`.
