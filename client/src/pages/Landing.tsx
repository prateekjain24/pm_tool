import { CTA } from "../components/sections/CTA";
import { Features } from "../components/sections/Features";
import { Hero } from "../components/sections/Hero";
import { Metrics } from "../components/sections/Metrics";

export function Landing() {
  return (
    <>
      <Hero />
      <Metrics />
      <Features />
      <CTA />
    </>
  );
}
