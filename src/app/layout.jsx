import "./globals.css";
import NavLinks from './components/NavLinks';
export const metadata = {
  title: "Road Safety Gambia — Report. Track. Fix.",
  description: "AI-powered road hazard reporting for The Gambia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="site-nav">
          <a href="/" className="site-nav__brand">Road Safety <span>Gambia</span></a>
          <NavLinks />
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}