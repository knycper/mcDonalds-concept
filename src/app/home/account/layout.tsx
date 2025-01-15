import { JSX } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RegisterLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    );
}