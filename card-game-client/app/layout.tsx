import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Provider } from "jotai";
import { CardsProvider } from "./context/CardsContent";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Quiz Game",
    description: "Created for COMP 3940",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <CardsProvider>
                    <Provider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </Provider>
                </CardsProvider>
            </body>
        </html>
    );
}
