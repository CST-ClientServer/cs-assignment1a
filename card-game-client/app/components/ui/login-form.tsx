"use client";
import React, {FormEvent} from "react";
import Card from "./card";
import { Button } from "./button";
import axios from "axios";
import {useSetAtom} from "jotai";
import {initialGamer} from "@/app/atom/atom";
import {useRouter} from "next/navigation";

export interface Gamer {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export const initialGamerAtom = {
    id: 0,
    email: "",
    role: "",
    firstName: "",
    lastName: "",
};

export default function LoginForm() {
    const setGamer = useSetAtom(initialGamer);
    const router = useRouter();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

      if (!email || !password) {
          window.alert("email and password can not be empty!");
          return;
      }

    const payload = {
        email: email.value,
        password: password.value,
    };

    axios({
        method: "post",
        url: "/gamer/login",
        data: payload,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((response) => {
        localStorage.setItem("token", response.data.token);
        setGamer({
            id: response.data.id,
            email: response.data.email,
            role: response.data.role,
            firstName: response.data.firstName,
            lastName: response.data.lastName
        })
        router.push("/dashboard");
    }).catch((error) => {
        console.log(error);
        alert("Invalid email or password");
    })
  }


  return (
    <Card className="w-72 h-72 justify-center">
      <form className="flex flex-col gap-4 h-full pt-2 w-full" onSubmit={handleLogin}>
        <div className="flex-grow flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="input border rounded-md w-full h-8 p-2 dark:bg-slate-200 dark:text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Password</p>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="input border rounded-md w-full h-8 p-2 dark:bg-slate-200 dark:text-black"
            />
          </div>
        </div>
        <Button
          variant="outline"
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
        >
          Sign in
        </Button>
      </form>
    </Card>
  );
}
