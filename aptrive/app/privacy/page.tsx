import type { Metadata } from "next";
import TickDivider from "@/components/TickDivider";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Aptrive collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="eyebrow">Legal</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-2">
            Last updated: July 20, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Aptrive (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This policy explains what
            information we collect, how we use it, and the choices you have
            when using our learning platform.
          </p>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-20">
        <div className="max-w-2xl space-y-10 text-sm leading-relaxed text-muted">
          <PolicySection title="Information we collect">
            <p>
              When you create an account, we collect your name, email address,
              and authentication credentials. When you use the platform, we
              collect practice activity, test scores, topic-level performance
              data, and usage analytics to personalize your learning
              experience.
            </p>
            <p className="mt-3">
              If you sign in with Google, we receive basic profile information
              provided by Google in accordance with your Google account
              settings.
            </p>
          </PolicySection>

          <PolicySection title="How we use your information">
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To provide and improve the Aptrive learning platform</li>
              <li>To personalize practice sequences and analytics</li>
              <li>To communicate account-related updates and support responses</li>
              <li>To maintain platform security and prevent misuse</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </PolicySection>

          <PolicySection title="Data sharing">
            <p>
              We do not sell your personal information. We may share data with
              trusted service providers (such as hosting and authentication
              providers) who process information on our behalf under strict
              confidentiality agreements. We may disclose information if
              required by law or to protect the rights and safety of Aptrive
              and its users.
            </p>
          </PolicySection>

          <PolicySection title="Data retention">
            <p>
              We retain your account and performance data for as long as your
              account is active or as needed to provide our services. You may
              request account deletion by contacting us at{" "}
              <a href="mailto:hello@aptrive.com" className="text-teal hover:underline">
                hello@aptrive.com
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection title="Your rights">
            <p>
              You may access, update, or delete your personal information by
              contacting us. You may also opt out of non-essential
              communications at any time.
            </p>
          </PolicySection>

          <PolicySection title="Security">
            <p>
              We implement industry-standard security measures to protect your
              data, including encrypted connections and secure authentication.
              No method of transmission over the internet is completely secure,
              and we cannot guarantee absolute security.
            </p>
          </PolicySection>

          <PolicySection title="Contact">
            <p>
              For privacy-related questions, contact us at{" "}
              <a href="mailto:hello@aptrive.com" className="text-teal hover:underline">
                hello@aptrive.com
              </a>
              .
            </p>
          </PolicySection>
        </div>
      </section>
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-fg">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
