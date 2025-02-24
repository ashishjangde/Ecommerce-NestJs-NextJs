import FooterHome from "./_components/FooterHome";
import NavbarHome from "./_components/NavbarHome";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <div >
          <NavbarHome />
          <div className="h-[calc(100vh-5rem)] w-[calc(100vw-2px)] mt-[72px]">
            <ScrollArea className="h-[calc(100vh-64px)] ">
                {children}
            </ScrollArea>
          </div>
          <FooterHome />
        </div>
  );
}
