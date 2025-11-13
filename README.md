# Vehicle Inspection App

Full-stack application for vehicle inspection with a 3-step wizard form.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with pg library

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure database in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_inspection
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
```

4. Create database and run migrations:
```bash
psql -U postgres -c "CREATE DATABASE vehicle_inspection;"
psql -U postgres -d vehicle_inspection -f src/database/schema.sql
```

5. Start backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## API Endpoints

- `POST /api/inspecciones` - Create new inspection
- `GET /api/inspecciones/:id` - Get inspection by ID
