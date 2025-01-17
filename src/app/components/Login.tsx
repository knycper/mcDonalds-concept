'use client';

import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>('')
  const [loginMessage, setLoginMessage] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setRemember(true)
      const usr = JSON.parse(user)
      setEmail(usr.email)
      setPassword(usr.password)
    }
  }, [])

  function toLocal() {
    if (remember) {
      const userObject = {
        email,
        password
      }
      localStorage.setItem('user', JSON.stringify(userObject))
    } else {
      const user = localStorage.getItem('user')
      if (user) {
        localStorage.removeItem('user')
      }
    }
  }

  function checkOrder() {
    const order = localStorage.getItem("order")
    if (!order) {
      localStorage.setItem("order", JSON.stringify([]))
    }
  }

  function tryToLogIn() {
    const data = {
      email,
      password
    }
    axios.post('http://localhost:3001/check', data)
      .then(res => {
        console.log(res.data.message)
        const { email, adress, phoneNumber } = res.data.user
        console.log(email, adress, phoneNumber)
        toLocal()
        const activeUser = {
          email,
          adress,
          phoneNumber
        }
        localStorage.setItem('activeUser', JSON.stringify(activeUser))
        axios.get(`http://localhost:3001/orders/order?email=${email}`)
          .then(res => {
            console.log("dziala")
            const { order } = res.data
            console.log(order)
            localStorage.setItem("order", JSON.stringify(order))
          })
          .catch(error => {
            const message = error.response?.data?.message || "Błąd połączenia z serwerem";
            console.log(message);
            setError(message)
          })
        checkOrder()
        router.push('/home')
        setError('')
        setLoginMessage("zalogowano pomyslnie")
      })
      .catch(error => {
        const message = error.response?.data?.message || "Błąd połączenia z serwerem";
        console.log(message);
        setError(message);
      })
  }

  function handleClick() {
    tryToLogIn()
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      tryToLogIn()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <div id="login-box" className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 text-center">Zaloguj się</h2>
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onKeyDown={handleEnter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onKeyDown={handleEnter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {error !== '' && (
          <p className="text-red-500 bg-red-100 border border-red-500 p-2 rounded-md text-sm mb-4">
            {`Wystąpił błąd podczas logowania: ${error}`}
          </p>
        )}
        {loginMessage !== '' && (
          <p className="text-green-500 bg-green-100 border border-green-500 p-2 rounded-md text-sm mb-4">
            {loginMessage}
          </p>
        )}
        <button
          onClick={handleClick}
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
