# Hunter Lost and Found 🔍
Backend of a web application for Hunter College community to report and claim lost items. Built to help students and staff easily locate lost belongings or return items they found.

## Features 
*   **RESTful API**: Endpoints for managing lost items, user authentication, and uploads.
*   **Database Management**: Uses Prisma ORM with PostgreSQL (Supabase) for robust data handling.
*   **Authentication**: Secure JWT-based authentication for user registration and login.
*   **Image Handling**: Support for uploading and serving item images.
*   **Item Management**: CRUD operations for lost items, including claiming functionality.

## Tech Stack 
*   **Node.js**: JavaScript runtime environment
*   **Express.js**: Web application framework
*   **Prisma**: Next-generation ORM for Node.js and TypeScript
*   **PostgreSQL**: Relational database (hosted on Supabase)
*   **JWT**: JSON Web Tokens for secure authentication

## Quick Start 

### Prerequisites
*   Node.js 16+
*   npm or yarn
*   PostgreSQL database (or Supabase project)

### Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ying2212/campus-LostFound-backend.git
    ```

2.  **Navigate to the project directory**
    ```bash
    cd campus-LostFound-backend
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Set up environment variables**
    *   Create a `.env` file in the root directory
    *   Add your database connection string and other secrets:
    ```
    DATABASE_URL="your_supabase_connection_string"
    DIRECT_URL="your_direct_connection_string"
    JWT_SECRET="your_jwt_secret"
    ```

5.  **Run database migrations**
    ```bash
    npx prisma migrate dev
    ```

6.  **Start the development server**
    ```bash
    npm run dev
    ```
    The server will be available at `http://localhost:8000`.
