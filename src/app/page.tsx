"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const sessionCookie = Cookies.get("session");
    if (sessionCookie) {
      setIsAuthenticated(true);
      const session = JSON.parse(sessionCookie);
      setUsername(session.username);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("session");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex justify-between w-full px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold">Hero</h1>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="px-4 py-2 font-bold text-white bg-red-500 rounded">
            Se déconnecter
          </button>
        ) : (
          <Link href="/auth">
            <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded">Se connecter</button>
          </Link>
        )}
      </header>
      <main className="flex flex-col items-center justify-center flex-1">
        {isAuthenticated ? (
          <h2 className="text-4xl font-bold">Welcome, {username}!</h2>
        ) : (
          <>
            <h2 className="text-4xl font-bold">Hero</h2>
            <Link href="/auth?signup=true">
              <button className="px-6 py-3 mt-4 font-bold text-white bg-green-500 rounded">Commencer</button>
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
