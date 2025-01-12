import { JSX } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function PaymentLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <div>
            {children}
        </div>
    );
}