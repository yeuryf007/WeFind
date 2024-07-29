import "@styles/globals.css";
import dynamic from 'next/dynamic';
import Script from "next/script";
import { AuthProvider } from "../context/AuthContext";
import SkeletonNav from "@components/SkeletonNav";

// Carga dinámica del componente Nav con un componente de esqueleto como fallback
const Nav = dynamic(() => import("@components/Nav"), {
  ssr: false,
  loading: () => <SkeletonNav />,
});

export const metadata = {
  title: "WeFind",
  description: "Buscador de productos",
};

const layoutRaiz = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="main"></div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default layoutRaiz;