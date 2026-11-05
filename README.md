# ☕ Neo Coffee – E-commerce Frontend

A feature-rich e-commerce frontend built with **React**, **Next.js**, and **TypeScript**.

Neo Coffee is a team-based e-commerce project designed to provide a seamless online shopping experience through a clean and maintainable UI architecture.

The frontend is developed by me, while the backend and database are developed separately using C# and ASP.NET Core.

## 🚀 Features

### Authentication & User Management
- User registration, login, and profile management
- Secure authentication handling utilizing backend HttpOnly cookies (JWT)
- Role-based UI rendering and protected routes

### Product Catalog & Search
- Dynamic product listing, categories, and brand filtering
- Advanced filtering, sorting, and pagination integrated with URL parameters
- Optimized image rendering with Fallback UI for missing or loading assets

### Shopping & Checkout
- Global state management for dynamic shopping cart operations
- Real-time cart calculations and optimistic UI updates
- Seamless checkout flow integration with backend order creation

### Discounts & Real-Time UI
- Discount code application and validation feedback
- Live countdown timers for expiring discounts and offers (without page refresh)

### Real-Time Support Chat
- Live customer support chat interface using SignalR client
- Instant messaging between customers and store admins

### Performance & UX
- Fully responsive design utilizing Tailwind CSS
- Server-Side Rendering (SSR) optimization and robust Hydration error handling

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Language | TypeScript, JavaScript (ES6+) |
| Framework | React, Next.js |
| Styling | Tailwind CSS |
| State Management | Context API / Custom Hooks |
| API Integration | Fetch API / Axios |
| Real-Time Communication | SignalR Client |
| Version Control | Git, GitHub |

## 🏛️ Architecture

The project follows a component-driven architecture to separate UI rendering from business logic and API integrations.

The solution is organized to maximize reusability and maintainability:

- **Components:** Reusable UI elements built with Tailwind CSS.
- **Pages / App:** Next.js routing structure defining the screens of the application.
- **Services:** API client modules dedicated to communicating with the ASP.NET Core backend.
- **Hooks:** Custom React hooks encapsulating complex UI logic and state management.
- **Types:** TypeScript definitions ensuring type safety across the frontend domain.

## 📁 Project Structure

```text
coffee-shop-monorepo/
│
├── public/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   └── types/
│
├── tailwind.config.js
└── package.json
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

### Clone the Repository

```bash
git clone [https://github.com/Shayan-Shams-2005/coffee-shop-monorepo.git](https://github.com/Shayan-Shams-2005/coffee-shop-monorepo.git)

cd coffee-shop-monorepo
```

### Configuration

Configure the required application settings before running the project.

Create a `.env.local` file in the root directory to configure the required environment variables to connect to the backend API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Run the Application

Open the project in your preferred IDE (like VS Code), install dependencies, and start the development server.

```bash
npm install
npm run dev
```

## 👨‍💻 Development

This project is actively developed and improved as part of an ongoing team project.

The main focus is on modern frontend architecture, robust state management, SSR performance optimization, and implementing practical software engineering and Clean Code concepts.

## 📫 Contact

**Developer:** Shayan Shams

- GitHub: [Shayan-Shams-2005](https://github.com/Shayan-Shams-2005)
- LinkedIn: [Shayan Shams](https://www.linkedin.com/in/shayan-shams-96870637b)
