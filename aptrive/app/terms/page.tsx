import type { Metadata } from "next";
import TickDivider from "@/components/TickDivider";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using the Aptrive learning platform.",
};

export default function TermsPage() {
  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="eyebrow">Legal</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-2">
            Last updated: July 20, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            These Terms of Service (&quot;Terms&quot;) govern your access to
            and use of the Aptrive platform. By creating an account or using
            our services, you agree to these Terms.
          </p>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-20">
        <div className="max-w-2xl space-y-10 text-sm leading-relaxed text-muted">
          <TermsSection title="Use of the platform">
            <p>
              Aptrive provides educational content and tools for university
              entrance exam preparation. You must provide accurate registration
              information and maintain the security of your account
              credentials. You agree to use the platform only for lawful,
              personal educational purposes.
            </p>
          </TermsSection>

          <TermsSection title="Accounts">
            <p>
              You are responsible for all activity under your account. You
              must be at least 13 years of age to use Aptrive. If you are
              under 18, you confirm that you have parental or guardian consent
              to use the platform.
            </p>
          </TermsSection>

          <TermsSection title="Content and intellectual property">
            <p>
              All content on Aptrive — including questions, explanations,
              analytics, and platform design — is owned by Aptrive or its
              licensors. You may not copy, redistribute, scrape, or resell
              platform content without written permission.
            </p>
          </TermsSection>

          <TermsSection title="Free and premium features">
            <p>
              Aptrive offers both free and premium features. Access to
              specific content may change as the platform evolves. Pricing
              and feature availability will be communicated clearly before
              any purchase.
            </p>
          </TermsSection>

          <TermsSection title="Disclaimer">
            <p>
              Aptrive is an educational tool and does not guarantee admission
              to any university. Practice results and analytics are estimates
              based on your performance on the platform and may differ from
              actual exam outcomes. Always verify merit formulas and admission
              criteria with official university sources.
            </p>
          </TermsSection>

          <TermsSection title="Limitation of liability">
            <p>
              To the fullest extent permitted by law, Aptrive shall not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of the platform.
            </p>
          </TermsSection>

          <TermsSection title="Termination">
            <p>
              We may suspend or terminate accounts that violate these Terms or
              misuse the platform. You may delete your account at any time by
              contacting{" "}
              <a href="mailto:hello@aptrive.com" className="text-teal hover:underline">
                hello@aptrive.com
              </a>
              .
            </p>
          </TermsSection>

          <TermsSection title="Changes to these Terms">
            <p>
              We may update these Terms from time to time. Continued use of
              Aptrive after changes are posted constitutes acceptance of the
              revised Terms.
            </p>
          </TermsSection>

          <TermsSection title="Contact">
            <p>
              Questions about these Terms? Email{" "}
              <a href="mailto:hello@aptrive.com" className="text-teal hover:underline">
                hello@aptrive.com
              </a>
              .
            </p>
          </TermsSection>
        </div>
      </section>
    </>
  );
}

function TermsSection({
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
