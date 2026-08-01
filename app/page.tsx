import type { Metadata } from "next";
import { PracticeApp } from "./PracticeApp";

export const metadata: Metadata = {
  title: "LaunchLift Practice App",
  description: "A safe, reusable app for learning and testing the LaunchLiftAI launch workflow.",
};

export default function Home() {
  return <PracticeApp />;
}
