import { JSX } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function DriverLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div className="h-screen">
            {children}
        </div>
    );
}