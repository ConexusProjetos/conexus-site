import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cnx-theme min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
