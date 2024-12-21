'use client';

import { ChangeEvent, useState, useEffect } from "react";

import Link from "next/link";

export default function Login() {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
        setRemember(true)
        const usr = JSON.parse(user)
        setLogin(usr.login)
        setPassword(usr.password)
    }
  }, [])

  function toLocal() {
    if (remember) {
        const userObject = {
            login: login,
            password: password
        }
        localStorage.setItem('user', JSON.stringify(userObject))
    } else {
        const user = localStorage.getItem('user')
        if (user) {
            localStorage.removeItem('user')
        }
    }
  }


  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (login.length !== 0 && password.length !== 0 && password.length >= 8) {
        if (remember) {
          toLocal()
          console.log("Zapamiętano dane użytkownika i go zalogowano");
        } else {
          localStorage.removeItem('user')
          setLogin('');
          setPassword('');
        }
      } else {
        setRemember(false)
        alert("haslo jest zbyt krotkie. Powinno zawierac conajmnniej 8 znakow")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <div id="login-box" className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 text-center">Zaloguj się</h2>

        {/* Login Input */}
        <input
          type="text"
          placeholder="E-mail"
          value={login}
          onKeyDown={handleEnter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onKeyDown={handleEnter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={() => console.log("Zalogowano")}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          Zaloguj się
        </button>
        <div className="flex items-center mb-4">
        <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            id="remember"
            className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
        />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
            Zapamiętaj użytkownika
        </label>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-700">Nie masz konta? </span>
          <Link
            href="/register"
            className="text-yellow-500 hover:underline text-sm font-medium"
          >
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  );
}
