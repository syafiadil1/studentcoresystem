import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { StudentCoreProvider } from "@/components/student-core-provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudentCore",
  description: "StudentCore helps you manage courses, tasks, timetable, assessments, and files in your own browser workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
        <StudentCoreProvider>
          <AppShell>{children}</AppShell>
        </StudentCoreProvider>
      </body>
    </html>
  );
}
