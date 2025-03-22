import './globals.css';
import Navbar from './components/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-google-analytics-opt-out="">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}