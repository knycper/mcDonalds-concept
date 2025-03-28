import { JSX } from "react";
import { MenuProvider } from "../components/MenuContext";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div className="h-screen">
            <main className="h-full">
                <MenuProvider>{children}</MenuProvider>
            </main>
        </div>
    );
}