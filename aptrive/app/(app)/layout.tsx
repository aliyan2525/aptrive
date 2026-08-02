import AuthHeader from "@/components/AuthHeader";
import Footer from "@/components/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      {/* Spacer matching the fixed header height to prevent content overlap */}
      <div className="h-20" aria-hidden />
      {children}
      <Footer />
    </>
  );
}
