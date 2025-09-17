import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
    subsets: ['latin', 'latin-ext'],
    weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "THE ML Catalogue.",
  description: "Explore machine learning algorithms through interactive visualizations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rubik.className}`} >
      <body className={`font-sans`}>
          {children}
      </body>
    </html>
  );
}
