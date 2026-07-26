import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordCheckEmailPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title="Check your inbox"
      subtitle="If an account exists for that email, we've sent a password reset link."
      footer={
        <Link href="/login" className="text-teal hover:underline">
          Back to login
        </Link>
      }
    >
      <p className="text-center text-sm text-muted">
        The link expires shortly, so use it soon. Didn&apos;t get it? Check your
        spam folder or{" "}
        <Link href="/forgot-password" className="text-teal hover:underline">
          try again
        </Link>
        .
      </p>
    </AuthShell>
  );
}
