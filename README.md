# DriveFleet — Server

Express + MongoDB REST API for the DriveFleet car rental platform.

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB (Atlas)
- JWT (HTTPOnly cookie)
- CORS with credentials

## 🚀 Getting Started

```bash
git clone 
cd drivefleet-server
npm install
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint    | Description            |
|--------|-------------|------------------------|
| POST   | /api/jwt    | Issue JWT cookie       |
| DELETE | /api/jwt    | Clear JWT cookie       |

### Cars
| Method | Endpoint              | Auth | Description                       |
|--------|-----------------------|------|-----------------------------------|
| GET    | /api/cars             | ❌   | Get all cars (search & filter)    |
| GET    | /api/cars/:id         | ❌   | Get single car                    |
| GET    | /api/cars/user/:email | ✅   | Get cars by owner email           |
| POST   | /api/cars             | ✅   | Add new car                       |
| PUT    | /api/cars/:id         | ✅   | Update car (owner only)           |
| PATCH  | /api/cars/:id         | ✅   | Increment booking count           |
| DELETE | /api/cars/:id         | ✅   | Delete car (owner only)           |

### Bookings
| Method | Endpoint                | Auth | Description              |
|--------|-------------------------|------|--------------------------|
| GET    | /api/bookings/:email    | ✅   | Get user bookings        |
| POST   | /api/bookings           | ✅   | Create booking           |
