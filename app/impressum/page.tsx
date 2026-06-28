import type { Metadata } from "next";
import LegalPage from "@/app/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Impressum | Simply Rational",
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Simply Rational GmbH
        <br />
        Alte Brauerei 14
        <br />
        DE-10965 Berlin
      </p>

      <h2>Vertreten durch die Geschäftsführer</h2>
      <p>Susanne Jung und Philipp Leipold</p>

      <h2>Kontakt</h2>
      <p>
        <a href="mailto:kontakt@simplyrational.de">kontakt@simplyrational.de</a>
      </p>

      <h2>Registereintrag</h2>
      <p>
        Eintragung im Handelsregister.
        <br />
        Registergericht: Amtsgericht Charlottenburg (Berlin)
        <br />
        Registernummer: HRB 171664 B
      </p>

      <h2>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz
      </h2>
      <p>DE302297756</p>
    </LegalPage>
  );
}
