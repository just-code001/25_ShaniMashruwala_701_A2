Shopping Cart Project (Admin + User)
Backend (Express + Mongoose + EJS admin views) and frontend static user site.
Run:
cd backend
cp .env.sample .env
npm install
npm run seed
npm run dev
Open:
Admin: http://localhost:5000/admin/login  (admin/admin123)
User site: http://localhost:5000/ or /shop
APIs:
GET /api/categories
GET /api/products
POST /api/orders
