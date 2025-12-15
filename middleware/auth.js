import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from '@prisma/client';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const prisma = new PrismaClient();

export async function authMiddleWare(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token);  

  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: "Invalid token" });
  let user = await prisma.user.findUnique({ where: { id: data.user.id } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: data.user.id, //supabase userid
        email: data.user.email,
        password: 'SUPABASE', // placeholder password
      },
    });
  }

  req.user = user;
  next();
}
