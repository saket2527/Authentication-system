import { Suspense } from "react";
import VerificationStatus from "./verification-status";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default function VerifyEmailPage(props: VerifyEmailPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p role="status">Loading verification link…</p>
        </main>
      }
    >
      <VerificationContent {...props} />
    </Suspense>
  );
}

async function VerificationContent({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const verificationToken = Array.isArray(token)
    ? (token[0] ?? "")
    : (token ?? "");

  return <VerificationStatus token={verificationToken} />;
}
