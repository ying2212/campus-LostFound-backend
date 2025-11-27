// Copy from professor's example
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from './generated/prisma/client.js'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

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

app.listen(8000, () => {
    console.log('Server is now running on localhost:8000!! Yippee!!')
})  