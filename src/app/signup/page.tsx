"use client";
import Link from "next/link";
import React from "react";
import axios from "axios";

export default function SignupPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [signupComplete, setSignupComplete] = React.useState(false);
  const buttonDisabled =
    !user.email.trim() || !user.password || !user.username.trim();

  const onSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      setLoading(true);
      await axios.post("/api/users/signup", user);
      setSignupComplete(true);
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

  if (signupComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p>We sent you a link to verify your account before logging in.</p>
        <Link href="/login" className="underline">
          Go to login
        </Link>
      </main>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={onSignup} className="flex w-full max-w-sm flex-col px-4">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          {loading ? "Processing" : "Signup"}
        </h1>
        <label htmlFor="username">Username</label>
        <input
          className="mb-4 rounded-lg border border-gray-300 p-2 text-white"
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
          className="mb-4 rounded-lg border border-gray-300 p-2 text-white"
          id="email"
          type="email"
          autoComplete="email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="mb-4 rounded-lg border border-gray-300 p-2 text-white"
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
