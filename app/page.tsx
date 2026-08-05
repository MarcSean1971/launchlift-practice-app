import type { Metadata } from "next";
import { PracticeApp } from "./PracticeApp";

export const metadata: Metadata = {
  title: "LaunchLift Practice App",
  description: "Review all 28 native functions in this unchanged source fixture, then import it into LaunchLiftAI.",
};

export default function Home() {
  return <PracticeApp />;
}
