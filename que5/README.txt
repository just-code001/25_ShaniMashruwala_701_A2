# Employee Site (JWT) — Express + MongoDB + Frontend (HTML/CSS/jQuery)
Features:
- Employee login with JWT
- Page 1: Profile (GET /api/me)
- Page 2: Leave Application (Add & List) (POST/GET /api/leaves)
- Logout (clear token)
- Mongoose models for Employee and Leave

## Run Backend
```
cd backend
cp .env.sample .env   # adjust values if needed
npm install
npm run seed          # creates john.doe@example.com / password123
npm run dev           # or: npm start
```
API runs at http://localhost:4000

## Run Frontend
Just open `frontend/index.html` in a browser, or serve the folder with any static server.

Login with:
- email: john.doe@example.com
- password: password123
