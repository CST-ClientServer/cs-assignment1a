import React from "react";
import LoginForm from "../components/ui/login-form";

export default function Login() {
    return (
        <div className="flex flex-col justify-center items-center dark:bg-zinc-900 min-h-screen p-48">
            <LoginForm />
        </div>
    );
}
