import { Navbar } from "../../components/layout/header/Navbar";
import { Footer } from "../../components/layout/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* هدر سایت */}
      <Navbar />

      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* فوتر سایت */}
      <Footer />
    </>
  );
}