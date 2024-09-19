import React from "react";
import Card from "./card";
import { Button } from "./button";

export default function LoginForm() {
  return (
    <Card className="w-72 h-72 justify-center">
      <form className="flex flex-col gap-4 h-full pt-2 w-full">
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
          Log in
        </Button>
      </form>
    </Card>
  );
}
