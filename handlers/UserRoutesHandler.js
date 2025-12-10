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
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const user = {
         id: req.user.id,
         email: req.user.email}

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
