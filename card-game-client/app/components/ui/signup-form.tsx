"use client";
import React, { FormEvent } from "react";
import Card from "./card";
import { Button } from "./button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = React.useState(false);

    const checkAdmin = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const code = prompt("Enter the admin code");
            if (code === "Comp3940") {
                alert("You are now an admin");
                setIsAdmin(true);
            } else {
                alert("Wrong code");
                event.target.checked = false;
            }
        } else {
            setIsAdmin(false);
        }
    };

    const handleSignup = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const firstName = document.getElementById(
            "firstname",
        ) as HTMLInputElement;
        const lastName = document.getElementById(
            "lastname",
        ) as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById(
            "password",
        ) as HTMLInputElement;

        if (!firstName || !lastName || !email || !password) {
            window.alert(
                "firstName, lastName, email and password can not be empty!",
            );
            return;
        }

        const userData = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            role: isAdmin ? "ADMIN" : "PLAYER",
        };

        axios({
            method: "post",
            url: "/gamers/",
            data: userData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then(() => {
                alert("signup success");
                router.push("/login");
            })
            .catch((error) => {
                console.log(error);
                alert("fail to signup");
            });
    };
    return (
        <Card className="w-96 justify-center flex flex-wrap">
            <form
                className="flex flex-col gap-4 h-full pt-2 w-full"
                onSubmit={handleSignup}
            >
                <div className="flex-grow flex flex-col gap-6">
                    <div className="flex items-center space-x-2">
                        <input
                            id="checkAdmin"
                            type="checkbox"
                            onChange={(e) => {
                                checkAdmin(e);
                            }}
                            defaultChecked={false}
                            className="border rounded-md h-5 w-5 dark:bg-slate-200 dark:text-black"
                        />
                        <label htmlFor="checkAdmin" className="text-sm">
                            Are you certified Administrator?
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p>First Name</p>
                        <input
                            id="firstname"
                            type="text"
                            placeholder="First Name"
                            className="input border rounded-md w-full h-8 p-2 dark:bg-slate-200 dark:text-black"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Last Name</p>
                        <input
                            id="lastname"
                            type="text"
                            placeholder="Last Name"
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
                <div className="flex flex-col gap-y-2 pt-4">
                    <Button
                        variant="outline"
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
                    >
                        Sign up
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push("/login")}
                        className="bg-gray-400 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
                    >
                        Back to sign in
                    </Button>
                </div>
            </form>
        </Card>
    );
}
