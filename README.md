# Simple E-Commerce Store

A basic full-stack e-commerce site: a vanilla HTML/CSS/JS frontend and a
Node.js/Express/MongoDB backend, kept completely separate and connected only
through a REST API.

```
ecommerce-store/
├── frontend/     → static site (open directly or serve with any static server)
└── backend/      → Express REST API + MongoDB
```

## Features

- Browse products, search, and filter by category
- Product detail pages with quantity selection
- Shopping cart (persisted in `localStorage`)
- User registration & login (JWT-based auth, passwords hashed with bcrypt)
- Checkout that creates a real order in the database
- Order history for the logged-in user
- Fully responsive layout (mobile, tablet, desktop)

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A MongoDB database — either:
  - a local MongoDB install (`mongod` running on `mongodb://127.0.0.1:27017`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your own values:

```
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-store
JWT_SECRET=some_long_random_string
PORT=5000
```

Load the database with sample products (run this once):

```bash
npm run seed
```

Start the API server:

```bash
npm start
```

You should see:

```
MongoDB connected: 127.0.0.1
Server running on http://localhost:5000
```

For auto-restart during development, use `npm run dev` instead (requires the
`nodemon` dev dependency, already listed in `package.json`).

## 2. Frontend setup

The frontend is plain HTML/CSS/JS — no build step required. From the
`frontend` folder, serve the files with any static file server, for example:

```bash
cd frontend
npx serve .
```

or, using Python:

```bash
cd frontend
python3 -m http.server 5500
```

Then open the printed URL (e.g. `http://localhost:5500`) in your browser.

> The frontend calls the API at `http://localhost:5000/api` by default. If
> your backend runs on a different port, update `API_BASE_URL` at the top of
> `frontend/js/api.js`.

## 3. Try it out

1. Visit the home page — products load from the backend automatically.
2. Register a new account from the **Register** link.
3. Add a few products to your cart and open the **Cart** page.
4. Go to **Checkout** and place the order (requires being logged in).
5. Check **My Orders** to see your order history.

## API Endpoints

| Method | Endpoint              | Description                        | Auth required |
|--------|------------------------|-------------------------------------|----------------|
| GET    | `/api/products`        | List all products (supports `?search=` and `?category=`) | No |
| GET    | `/api/products/:id`    | Get a single product                | No |
| POST   | `/api/products`        | Create a product                    | No |
| PUT    | `/api/products/:id`    | Update a product                    | No |
| DELETE | `/api/products/:id`    | Delete a product                    | No |
| POST   | `/api/auth/register`   | Register a new user                 | No |
| POST   | `/api/auth/login`      | Login and receive a JWT             | No |
| POST   | `/api/orders`          | Create an order from cart items     | Yes |
| GET    | `/api/orders`          | List the logged-in user's orders    | Yes |
| GET    | `/api/orders/:id`      | Get a single order                  | Yes |

Authenticated requests must include the JWT in the header:

```
Authorization: Bearer <token>
```

## Notes on security

- Passwords are hashed with `bcryptjs` before being stored — plain-text
  passwords are never saved.
- Authentication uses JWTs signed with `JWT_SECRET`, expiring after 7 days.
- Order creation and order history routes are protected by
  `middleware/authMiddleware.js`.
- The product create/update/delete routes are left open in this demo for
  simplicity. In a production app, you'd add an admin role and protect them
  with the same `protect` middleware (plus a role check).

## Notes on the frontend

- Cart contents and the JWT token are stored in `localStorage`, so the cart
  survives page refreshes and closing the browser tab.
- All API calls live in `frontend/js/api.js` — change `API_BASE_URL` there if
  you deploy the backend somewhere other than `localhost:5000`.
