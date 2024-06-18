import { NextApiRequest, NextApiResponse } from "next";

// Fonction handler pour traiter la requête
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifiez si la méthode de la requête est GET
  if (req.method === "GET") {
    // Répondez avec un JSON simple
    res.status(200).json({ message: "Hello, this is a simple API GET response!" });
  } else {
    // Répondez avec une erreur pour les méthodes non supportées
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
