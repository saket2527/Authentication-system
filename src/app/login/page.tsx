"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await axios.post("/api/users/login", { email, password });
      router.push("/profile");
    } catch (error: unknown) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.error ?? "Login failed. Please try again.",
        );
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-2">
      <form
        onSubmit={onLogin}
        className="flex w-full max-w-sm flex-col gap-3 px-4"
      >
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        <label htmlFor="email">Email</label>
        <input
          className="rounded-lg border border-gray-300 p-2 text-white"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="rounded-lg border border-gray-300 p-2 text-white"
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="rounded-lg border border-gray-300 p-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link href="/signup" className="text-center underline">
          Create an account
        </Link>
      </form>
    </main>
  );
}
