"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const sessionCookie = Cookies.get("session");
    if (sessionCookie) {
      const sessionData = JSON.parse(sessionCookie);
      setIsLoggedIn(true);
      setUsername(sessionData.username);
    }
    const signupParam = searchParams?.get("signup");
    if (signupParam) {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const response = await axios.post("/api/auth/signin", { username, password });
        Cookies.set("session", JSON.stringify({ username }), { path: "/" });
        setIsLoggedIn(true);
        alertify.success("Connection réussie !");
      } else {
        const response = await axios.post("/api/auth/signup", { username, password });
        Cookies.set("session", JSON.stringify({ username }), { path: "/" });
        setIsLoggedIn(true);
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
    alertify.success("Déconnexion réussie !");
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
