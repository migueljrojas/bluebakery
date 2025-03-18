import { 
  Merienda,
  ABeeZee,
  Leckerli_One
 } from 'next/font/google'
import "./globals.css";

const meriendaOne = Merienda({
  subsets: ["latin"],
  style: ['normal'],
  variable: '--font-meriendaOne',
});

const aBeeZee = ABeeZee({
  subsets: ["latin"],
  style: ['normal'],
  weight: ['400'],
  variable: '--font-aBeeZee',
});

const leckerliOne = Leckerli_One({
  subsets: ["latin"],
  style: ['normal'],
  weight: ['400'],
  variable: '--font-leckerliOne',
});

export const metadata = {
  title: "Blue Bakery | Postres sin glúten, postres sin lacteos",
  description: 'Postres deliciosos sin glúten, con calidad artesanal.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${meriendaOne.variable} ${aBeeZee.variable} ${leckerliOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}