import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export default function CheckEmailPage() {
  return (
    <AuthShell
      eyebrow="One more step"
      title="Check your inbox"
      subtitle="We've sent a confirmation link to your email. Click it to activate your account."
      footer={
        <>
          Wrong email or didn&apos;t get it?{" "}
          <Link href="/signup" className="text-teal hover:underline">
            Try again
          </Link>
        </>
      }
    >
      <p className="text-center text-sm text-muted">
        Once confirmed, you can{" "}
        <Link href="/login" className="text-teal hover:underline">
          log in
        </Link>{" "}
        and jump straight into the Library.
      </p>
    </AuthShell>
  );
}
