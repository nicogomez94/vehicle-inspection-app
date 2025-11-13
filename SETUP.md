# Quick Start Guide

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Git (optional)

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=vehicle_inspection
# DB_USER=postgres
# DB_PASSWORD=your_password
# PORT=3001
```

### 2. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE vehicle_inspection;"

# Run migrations
psql -U postgres -d vehicle_inspection -f src/database/schema.sql
```

If you don't have psql in your PATH, you can also run the SQL manually:

```sql
CREATE DATABASE vehicle_inspection;

-- Connect to the database, then run:
CREATE TABLE IF NOT EXISTS inspecciones (
  id SERIAL PRIMARY KEY,
  owner_name TEXT NOT NULL,
  brand_model TEXT NOT NULL,
  plate TEXT NOT NULL,
  notes TEXT,
  photos TEXT[],
  signature TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Start Backend

```bash
cd backend
npm run dev
```

Backend should be running on `http://localhost:3001`

### 4. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should be running on `http://localhost:5173`

## 🧪 Testing the Application

1. Open your browser at `http://localhost:5173`
2. Fill out Step 1 with vehicle details
3. Upload photos in Step 2
4. Draw a signature in Step 3
5. Submit the form
6. You should see a success message with the inspection ID

## 📁 Project Structure

```
vehicle-inspection-app/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.ts           # PostgreSQL connection
│   │   │   └── schema.sql      # Database schema
│   │   ├── routes/
│   │   │   └── inspecciones.ts # API routes
│   │   ├── types/
│   │   │   └── inspeccion.ts   # TypeScript types
│   │   └── index.ts            # Express app
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── inspecciones.ts  # API client
    │   ├── components/
    │   │   ├── Step1.tsx         # Vehicle data form
    │   │   ├── Step2.tsx         # Photos & notes form
    │   │   └── Step3.tsx         # Signature pad
    │   ├── types/
    │   │   └── inspeccion.ts     # TypeScript types
    │   ├── App.tsx               # Main wizard component
    │   ├── main.tsx              # React entry point
    │   └── index.css             # Styles
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🔧 API Endpoints

### POST /api/inspecciones
Creates a new vehicle inspection.

**Request Body:**
```json
{
  "ownerName": "John Doe",
  "brandModel": "Toyota Corolla 2020",
  "plate": "ABC-123",
  "notes": "Vehicle in good condition",
  "photos": ["data:image/png;base64,...", "data:image/png;base64,..."],
  "signature": "data:image/png;base64,...",
  "createdAt": "2025-11-13T10:30:00.000Z"
}
```

**Response:**
```json
{
  "id": 1,
  "ownerName": "John Doe",
  "brandModel": "Toyota Corolla 2020",
  "plate": "ABC-123",
  "notes": "Vehicle in good condition",
  "photos": ["data:image/png;base64,..."],
  "signature": "data:image/png;base64,...",
  "createdAt": "2025-11-13T10:30:00.000Z"
}
```

### GET /api/inspecciones/:id
Retrieves an inspection by ID.

**Response:**
```json
{
  "id": 1,
  "ownerName": "John Doe",
  "brandModel": "Toyota Corolla 2020",
  "plate": "ABC-123",
  "notes": "Vehicle in good condition",
  "photos": ["data:image/png;base64,..."],
  "signature": "data:image/png;base64,...",
  "createdAt": "2025-11-13T10:30:00.000Z"
}
```

## 🎨 Features

✅ **3-Step Wizard Form**
- Step 1: Vehicle owner, brand/model, and plate
- Step 2: Multiple photo uploads with preview
- Step 3: Canvas signature pad

✅ **Form Validation**
- Required field validation
- Navigation between steps
- Form state preservation

✅ **Photo Management**
- Multiple photo upload
- Base64 encoding
- Preview and remove functionality

✅ **Signature Capture**
- HTML5 canvas-based signature pad
- Touch and mouse support
- Clear and redraw functionality

✅ **Backend API**
- RESTful endpoints
- PostgreSQL with pg library
- Input validation
- Error handling

## 🐛 Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running
- Verify .env credentials
- Ensure port 3001 is available

**Frontend won't start:**
- Ensure backend is running first
- Check port 5173 is available
- Clear node_modules and reinstall

**Database connection error:**
- Verify PostgreSQL service is running
- Check credentials in .env
- Ensure database was created

**Photos not uploading:**
- Check browser console for errors
- Large images may take time to encode
- Increase JSON payload limit if needed

## 📝 Notes

- Photos are stored as base64 strings in the database
- Signature is captured as PNG base64
- All fields except notes are required
- The app uses Vite proxy for API calls in development
