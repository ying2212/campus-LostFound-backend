// Copy from professor's example
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
import { createClient } from '@supabase/supabase-js'
import { authMiddleWare } from './middleware/auth.js'
import itemRoutes from './routes/ItemRoutes.js'
import userRoutes from './routes/UserRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config()
const app = express()
const prisma = new PrismaClient()

// Supabase setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

app.use(express.json())
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)

app.get('/', (req, res) => {
    res.send('Hi! This is the backend server endpoint!!')
})


// POST endpoint
app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)

export {supabase}

const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log(`Server is now running on localhost:${PORT}!! Yippee!!`)
})  