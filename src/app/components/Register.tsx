'use client';

import Link from "next/link";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confPassw, setConfPassw] = useState<string>('');
  const [adress, setAdress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [num, setNum] = useState<boolean>(false)
  const [bigLetter, setBigLetter] = useState<boolean>(false)
  const [eight, setEight] = useState<boolean>(false)
  const [emailOkay, setEmailOkay] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const router = useRouter()

  function checkNum(passw: string): boolean {
    const hasNumber = /\d/.test(passw);
    return hasNumber
  }

  function checkBigLetter(passw: string): boolean {
    const hasUpperCase = /[A-Z]/.test(passw);
    return hasUpperCase
  }

  function checkEigth(passw: string): boolean {
    const hasEigth = passw.length >= 8 ? true : false
    return hasEigth
  }

  function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const pass = e.target.value
    setPassword(pass)
    setNum(checkNum(pass))
    setBigLetter(checkBigLetter(pass))
    setEight(checkEigth(pass))
  }

  function checkEmail(mail: string) {
    if (emailRegex.test(mail)) {
        setEmailOkay(true)
    } else {
        setEmailOkay(false)
    }
  }

  function handleOnChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const mail = e.target.value
    setEmail(mail)
    checkEmail(mail)
  }

  function checkPassw(): boolean {
    if (num && bigLetter && eight) {
        if (password === confPassw) {
            return true
        } else {
            setError("podane hasła różnią się! Spróbuj jeszcze raz")
            setConfPassw('')
            return false
        }
    } else {
        setError("Podane hasło nie zawiera któregoś z oczekiwanych elementów! Spróbuj jeszcze raz");
        setPassword('')
        setConfPassw('')
        return false
    }
  }

  function handleRegister() {
    if (checkPassw() && emailOkay) {
        const data = {
          email,
          password,
          adress,
          phoneNumber
        }
        axios.post("http://localhost:3001/register", data)
        .then(response => {
          console.log("dostalem info od serwera: ", response.data.message)
          if (response.data.message === "Użytkownik zarejestrowany pomyślnie!") {
            router.push('/')
          } else {
            setError(`Błąd: ${response.data.message}`)
          }
        })
        .catch(error => {
          console.log(error)
          setError(`Wystąpił błąd podczas rejestracji: ${error.response.data.message}`)
        })
    }
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleRegister()
    }
  }

  function handleButton() {
    handleRegister()
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <div id="register-box" className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 text-center">Zarejestruj się</h2>
        <input
          type="text"
          placeholder="Podaj e-mail"
          id="login"
          value={email}
          onKeyDown={handleEnter}
          onChange={handleOnChangeEmail}
          className={`${emailOkay ? 'text-green-500' : 'text-red-500'} w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
        <input
          type="password"
          placeholder="Podaj hasło (co najmniej 8 znaków)"
          id="haslo"
          value={password}
          onKeyDown={handleEnter}
          onChange={handleOnChangePassword}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <div className="mb-2">
          Haslo powinno zawierać:
          <p className={`text-sm ${bigLetter ? 'text-green-500' : 'text-red-500'}`}>
            Co najmniej 1 dużą literę
          </p>
          <p className={`text-sm ${num ? 'text-green-500' : 'text-red-500'}`}>
            Co najmniej 1 cyfrę
          </p>
          <p className={`text-sm ${eight ? 'text-green-500' : 'text-red-500'}`}>
            Co najmniej 8 znaków
          </p>
        </div>
        <input
          type="password"
          placeholder="Powtórz hasło"
          id="haslo-powtorz"
          value={confPassw}
          onKeyDown={handleEnter}
          onChange={(e) => setConfPassw(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {error !== '' && (
          <p className="text-red-500 bg-red-100 border border-red-500 p-2 rounded-md text-sm mb-4">
            {`Wystąpił błąd podczas rejestracji: ${error}`}
          </p>
        )}
        <p className="text-sm text-yellow-600 mb-4">Podaj adres zamieszkania i nr telefonu, aby nie podawać przy dostawie! (opcjonalne)</p>
        <input
          type="text"
          placeholder="Podaj adres zamieszkania"
          id="adres-zam"
          value={adress}
          onKeyDown={handleEnter}
          onChange={(e) => setAdress(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="tel"
          placeholder="Podaj nr telefonu"
          id="nr-tel"
          value={phoneNumber}
          onKeyDown={handleEnter}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleButton}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          Zarejestruj się
        </button>
        <Link
         href="/"
         className="text-yellow-600 underline"
        >
            Wróć do logowania
        </Link>
      </div>
    </div>
  );
}
