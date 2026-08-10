import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scene3DProvider } from "@/components/three/Scene3DProvider";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";
import PageTransition from "@/components/transitions/PageTransition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScrollProvider>
        <Scene3DProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </Scene3DProvider>
      </SmoothScrollProvider>
    </>
  );
}
