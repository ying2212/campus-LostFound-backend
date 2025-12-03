import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Register new user
export async function registerUser(req, res) {
    const { email, password } = req.body;

    // Email validation
    if (!(email.endsWith('@hunter.cuny.edu') || email.endsWith('@myhunter.cuny.edu'))) {
        return res.status(400).json({ error: 'Email must be a Hunter College email address.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/dashboard',
            }
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Create user in the database
        await prisma.user.create({
            data: {
                id: data.user.id,
                email: email,
                password: password,
            },
        });

        res.json({
            message: 'Registration successful! Please check your email to verify your account.',
            user: data.user,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
}

// Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required!' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Check if email is verified
        if (!data.user.email_confirmed_at) {
            return res.status(400).json({ error: 'Please verify your email before logging in. Check your inbox!' });
        }

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
}

// Get current user
export async function getCurrentUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Resend verification email
export async function resendVerification(req, res) {
    const { email } = req.body;

    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Verification email sent!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
