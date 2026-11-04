"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const buttonDisabled =
    !user.email.trim() || !user.password || !user.username.trim();

  const onSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.error ?? "Signup failed. Please try again.",
        );
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={onSignup} className="flex w-full max-w-sm flex-col px-4">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          {loading ? "Processing" : "Signup"}
        </h1>
        <label htmlFor="username">Username</label>
        <input
          className="mb-4 rounded-lg border border-gray-300 p-2 text-black"
          id="username"
          type="text"
          autoComplete="username"
          value={user.username}
          onChange={(event) =>
            setUser({ ...user, username: event.target.value })
          }
          required
        />
        <label htmlFor="email">Email</label>
        <input
          className="mb-4 rounded-lg border border-gray-300 p-2 text-black"
          id="email"
          type="email"
          autoComplete="email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="mb-4 rounded-lg border border-gray-300 p-2 text-black"
          id="password"
          type="password"
          autoComplete="new-password"
          value={user.password}
          onChange={(event) =>
            setUser({ ...user, password: event.target.value })
          }
          required
        />
        {errorMessage && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={buttonDisabled || loading}
          className="mb-4 rounded-lg border border-gray-300 p-2 disabled:opacity-60"
        >
          {loading ? "Processing" : "Signup"}
        </button>
        <Link href="/login" className="text-center underline">
          Visit login page
        </Link>
      </form>
    </div>
  );
}
