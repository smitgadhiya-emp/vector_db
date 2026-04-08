# Node.js + TypeScript + MongoDB Boilerplate

Module-based boilerplate using Express, TypeScript, and Mongoose.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — start with nodemon + ts-node
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled output

## Structure

```
src/
├── app.ts                  # Express app setup
├── server.ts               # Entry point
├── config/
│   ├── db.ts               # MongoDB connection
│   └── env.ts              # Environment loader
├── middlewares/
│   └── error.middleware.ts
├── routes/
│   └── index.ts            # Root router
└── modules/
    └── user/               # User module
        ├── user.interface.ts
        ├── user.model.ts
        ├── user.service.ts
        ├── user.controller.ts
        └── user.route.ts
```

## User API

Base: `/api/v1/users`

| Method | Path   | Description     |
|--------|--------|-----------------|
| POST   | `/`    | Create user     |
| GET    | `/`    | List users      |
| GET    | `/:id` | Get user by id  |
| PUT    | `/:id` | Update user     |
| DELETE | `/:id` | Delete user     |
