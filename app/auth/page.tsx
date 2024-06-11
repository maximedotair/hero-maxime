"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Ensure you have js-cookie installed
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css"; // Import Alertify CSS

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true); // Confirm the component is rendered on the client-side
    const sessionCookie = Cookies.get("session");
    if (sessionCookie) {
      const sessionData = JSON.parse(sessionCookie);
      setIsLoggedIn(true);
      setUsername(sessionData.username); // Convert string to JSON object first
    }
  }, []);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const response = await axios.post("/api/auth/signin", { username, password });
        Cookies.set("session", JSON.stringify({ username }), { path: "/" });
        setIsLoggedIn(true);
        alertify.success("Connection réussie !");
      } else {
        await axios.post("/api/auth/signup", { username, password });
        alertify.success("Inscription réussie !");
      }
      router.push("/");
    } catch (error) {
      console.error(error);
      alertify.error("Échec de l'authentification. Veuillez réessayer.");
    }
  };

  const handleLogout = () => {
    Cookies.remove("session");
    setIsLoggedIn(false);
    setUsername("");
    router.push("/");
    alertify.success("Connexion réussie !");
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md">
        <h2 className="mb-4 text-2xl font-bold">{isLoggedIn ? `Welcome` : isLogin ? "Se connecter" : "S’inscrire"}</h2>
        {!isLoggedIn ? (
          <>
            <input type="text" placeholder="Username" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleAuth} className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded">
              {isLogin ? "Se connecter" : "S’inscrire"}
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded">
            Se déconnecter
          </button>
        )}
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500">
            {isLogin ? "S’inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
