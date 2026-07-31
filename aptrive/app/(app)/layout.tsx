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
      {children}
      <Footer />
    </>
  );
}
