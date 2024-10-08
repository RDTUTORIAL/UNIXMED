import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/style/signup.css";
import "@/style/sigUp_Login.css";
import Script from "next/script"
import Transition from "@/components/Transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login dan SignUp",
  description: "SIGN UP TO UNIXMED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Learn more about us." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/js/all.js" integrity="sha256-2JRzNxMJiS0aHOJjG+liqsEOuBb6++9cY4dSOyiijX4="/>
        <script src="https://kit.fontawesome.com/cd705c9d2a.js"/>
      </head>
      <body className={inter.className}>
        <Transition>
          {children}
        </Transition>
      </body>
    </html>
  );
}





