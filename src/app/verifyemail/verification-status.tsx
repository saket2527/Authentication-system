"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VerificationState = "checking" | "verified" | "error" | "invalid";

export default function VerificationStatus({ token }: { token: string }) {
  const [state, setState] = useState<VerificationState>(
    token ? "checking" : "invalid",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const requestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    requestRef.current ??= axios
      .post("/api/users/verifyemail", { token })
      .then(() => undefined);

    requestRef.current
      .then(() => {
        if (active) {
          setState("verified");
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        setErrorMessage(
          axios.isAxiosError<{ error?: string }>(error)
            ? (error.response?.data?.error ?? "Email verification failed.")
            : "Email verification failed. Please try again.",
        );
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [attempt, token]);

  const retry = () => {
    requestRef.current = null;
    setErrorMessage("");
    setState("checking");
    setAttempt((currentAttempt) => currentAttempt + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl">Verify email</h1>
      {state === "checking" && <p role="status">Verifying your email…</p>}
      {state === "verified" && (
        <>
          <p role="status">Email verified successfully.</p>
          <Link href="/login" className="underline">
            Go to login
          </Link>
        </>
      )}
      {state === "invalid" && (
        <p role="alert">This verification link is missing or invalid.</p>
      )}
      {state === "error" && (
        <>
          <p role="alert">{errorMessage}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Try again
          </button>
        </>
      )}
    </main>
  );
}
