# B2B Connect

A B2B marketplace and order management app. Buyers browse suppliers and place orders, vendors manage products and fulfillment, and admins manage users, vendor approvals, and orders.

[Link](https://order-management-mu-five.vercel.app/)

## Stack

- `frontend/` — React, Vite, React Router, and Tailwind CSS
- `backend/` — Express, MongoDB, Mongoose, and JWT authentication

## Run locally

Use Node.js 24, npm, and a reachable MongoDB database. Create `backend/.env` with these values:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/b2b-connect
JWT_SECRET=replace-with-a-long-random-secret
```

Start the backend from the repository root:

```sh
cd backend
npm ci
npm start
```

In a second terminal, start the frontend:

```sh
cd frontend
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). Vite proxies API and legacy upload requests to Express on port 5000. Use `npm run build` from `frontend/` to generate the production bundle.

## Deploy on Vercel

1. Push the code to the Git branch that Vercel will deploy.
2. Import the repository with root directory `./` and the **Services** preset. The root `vercel.json` routes `/api/*` to Express and the app routes to Vite.
3. Set `MONGO_URI` and `JWT_SECRET` for each environment you deploy. The MongoDB server must accept connections from the deployed backend.
4. Deploy and check the home page, sign-in, a vendor catalog, and a vendor logo upload.

## Vendor logo storage

Vendor registration and admin onboarding accept JPEG, PNG, WebP, and GIF logos up to 3 MB. Uploaded files are stored in MongoDB and served by the vendor logo API.

To migrate older logos stored under `backend/uploads/`, run these commands from `backend/` with `MONGO_URI` pointing to the intended database. Review the preview before applying:

```sh
node scripts/migrate-vendor-logos.js
node scripts/migrate-vendor-logos.js --apply
```
