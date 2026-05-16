import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexion",
  description: "Gerencie projetos, docs e tarefas com IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
