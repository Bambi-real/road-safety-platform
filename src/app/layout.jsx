import "./globals.css";

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
          <div className="site-nav__links">
            <a href="/report">Report</a>
            <a href="/map">Map</a>
            <a href="/my-reports">My Reports</a>
            <a href="/analytics">Analytics</a>
            <a href="/admin">Admin</a>
            <a href="/login">Log in</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}