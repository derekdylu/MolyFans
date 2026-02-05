import { redirect } from "next/navigation";

export default function DocsIndexPage() {
  // Default docs language: English
  redirect("/docs/en");
}
