import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Simple Pricing for Creators",
  description: "Free, Pro, and Max pricing for RSP AI Editor, plus credit packs for overflow usage.",
};

export default function PricingPage() {
  return <PricingClient />;
}
