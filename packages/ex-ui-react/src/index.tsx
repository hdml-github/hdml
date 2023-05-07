import * as React from "react";
import { createRoot } from "react-dom/client";
import { defineDefaults } from "@hdml/elements";
import { Builder } from "./components/Builder";

export async function bootstrap(): Promise<void> {
  await defineDefaults();
  const root = window.document.getElementById("query_builder");
  root && createRoot(root).render(<Builder />);
}
