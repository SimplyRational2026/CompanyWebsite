import type { Metadata } from "next";
import BarometerPage from "@/app/components/barometer/BarometerPage";

export const metadata: Metadata = {
  title: "Entscheidungsbarometer | Simply Rational",
  description:
    "Was gute Entscheidungen wirklich möglich macht. Das Entscheidungsbarometer macht sichtbar, unter welchen Bedingungen Entscheidungen in Ihrer Organisation entstehen.",
};

export default function EntscheidungsbarometerPage() {
  return <BarometerPage />;
}
