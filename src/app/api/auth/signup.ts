import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  const client = await clientPromise;
  const db = client.db("nextauth");

  const existingUser = await db.collection("users").findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "Le nom d'utilisateur existe déjà" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.collection("users").insertOne({
    username,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Inscription réussie", username });
}
