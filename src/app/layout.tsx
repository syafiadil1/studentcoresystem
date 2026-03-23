import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { StudentCoreProvider } from "@/components/student-core-provider";

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
      <body className="antialiased">
        <StudentCoreProvider>
          <AppShell>{children}</AppShell>
        </StudentCoreProvider>
      </body>
    </html>
  );
}
