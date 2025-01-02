import { JSX } from "react";
import { MenuProvider } from "@/app/components/MenuContext";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function NameLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div className="h-screen">
            <main className="h-full">
                <MenuProvider>{children}</MenuProvider>
            </main>
        </div>
    );
}