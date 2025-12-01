import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL);

export async function authMiddleWare(req, res, next) {
  const token = req.header.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
}
