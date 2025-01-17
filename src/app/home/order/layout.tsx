import { JSX } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function OrderLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div>
            {children}
        </div>
    );
}