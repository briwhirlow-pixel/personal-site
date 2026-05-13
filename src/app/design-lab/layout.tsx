import { Bricolage_Grotesque, EB_Garamond, Archivo_Black } from "next/font/google";

// Lab-only fonts — kept out of the root layout so the production site
// doesn't pay the cost. These are referenced by the four mocked direction
// tiles on /design-lab and nowhere else.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const ebGaramond = EB_Garamond({
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const archivoBlack = Archivo_Black({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});

export default function DesignLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${ebGaramond.variable} ${archivoBlack.variable}`}>
      {children}
    </div>
  );
}
