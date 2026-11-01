import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import "./globals.css";

const josefinSans =  Josefin_Sans({ 
  subsets: ['latin'],
 });

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={cn("font-sans", josefinSans.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}