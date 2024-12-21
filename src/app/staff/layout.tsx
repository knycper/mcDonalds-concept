import { JSX } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function staffLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    )
}