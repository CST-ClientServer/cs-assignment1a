"use client";
import React, {FormEvent} from "react";
import Card from "./card";
import { Button } from "./button";
import axios from "axios";
import {useSetAtom} from "jotai";
import {initialGamer} from "@/app/atom/atom";
import {useRouter} from "next/navigation";


export default function SignupForm() {
  const setGamer = useSetAtom(initialGamer);
  const router = useRouter();

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = document.getElementById("username") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    if (!username || !email || !password) {
      window.alert("username, email and password can not be empty!");
      return;
    }

    const userData = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    axios({
      method: "post",
      url: "/signup",
      data: userData,
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
      alert("fail to signup");
    })
  }
  return (
      <Card className="w-72 h-90 justify-center">
        <form className="flex flex-col gap-4 h-full pt-2 w-full" onSubmit={handleSignup}>
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p>Username</p>
              <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="input border rounded-md w-full h-8 p-2 dark:bg-slate-200 dark:text-black"

              />
            </div>
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
            Sign up
          </Button>
        </form>
      </Card>
  );
} 