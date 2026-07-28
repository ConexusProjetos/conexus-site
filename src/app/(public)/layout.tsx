import { getServicesNav } from "@/lib/nav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navServices = await getServicesNav();
  return (
    <div className="cnx-theme min-h-screen">
      <Header services={navServices} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
