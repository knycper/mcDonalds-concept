import './styles/globals.css';

import { JSX } from "react";


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    );
}
