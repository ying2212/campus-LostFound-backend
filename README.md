## Setup

1. Clone the repository:
```bash
git clone https://github.com/ying2212/campus-LostFound-backend.git
```

2. Download the dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase database URL:
```
DATABASE_URL="your_supabase_connection_string"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```
