import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import SignupCompleteEvent from "@/components/analytics/SignupCompleteEvent";

export default function CheckEmailPage() {
  return (
    <AuthShell
      eyebrow="One more step"
      title="Check your inbox"
      subtitle="We sent a confirmation link to your email. Activate your account, then sign in to build your study plan."
      footer={
        <>
          Wrong email or didn&apos;t get it?{" "}
          <Link href="/signup" className="text-teal hover:underline">
            Try again
          </Link>
        </>
      }
    >
      <SignupCompleteEvent />

      <p className="text-center text-sm text-muted">
        Once confirmed, you can{" "}
        <Link href="/login" className="text-teal hover:underline">
          sign in
        </Link>{" "}
        and complete your target setup before starting practice.
      </p>
    </AuthShell>
  );
}
