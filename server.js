// Copy from professor's example
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
import { createClient } from '@supabase/supabase-js'
import { authMiddleWare } from './middleware/auth.js'
import itemRoutes from './routes/ItemRoutes.js'
import userRoutes from './routes/UserRoutes.js'

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

// Register with Hunter email validation
app.post('/register', async (req, res) => {
    const{email,password} = req.body;

    // Simple validation
    if (!(email.endsWith('@hunter.cuny.edu')||email.endsWith('@myhunter.cuny.edu'))){

        return res.status(400).json({error: 'Email must be a Hunter College email address.'});
    }
    try{
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/dashboard', // direcitng to DashBoard after email is verified
            }
        })
        if(error){
            return res.status(400).json({ error: error.message })
        }
        // Create user in the database
        await prisma.user.create({
            data: {
                id: data.user.id,
                email: email,
                password: password,
            },
        })
        res.json({
            message: 'Registration successful! Please check your email to verify your account.',
            user: data.user,
        })
    }catch(error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
})

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ error: 'Email and password are required!' });
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ // it sends verification email automatically
            email,
            password,
        });
        if (error){
            return res.status(400).json({ error: error.message });
        }
        // if the email has not verified yet
        if (!data.user.email_confirmed_at) {
            return res.status(400).json({ error: 'Please verify your email before logging in. Check your inbox!' });
        }
        res.json({ 
            token: data.session.access_token,
            user: {
              id: data.user.id,
              email: data.user.email,
            }
        })
    }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
})

// Get current user
app.get('/me', authMiddleWare, async(req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select:{
                id: true,
                email: true,
            }
        });
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
})

// User can choose resend verification email if needed
app.post('/resend-verification', async (req, res) => {
    const { email } = req.body
  
    try {
        const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        })
    if (error){
        return res.status(400).json({ error: error.message })
    }
    res.json({ message: 'Verification email sent!' })
    }catch(error) {
        res.status(500).json({ error: error.message })
    }
})

// POST endpoint
app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)

export {supabase}

const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log(`Server is now running on localhost:${PORT}!! Yippee!!`)
})  