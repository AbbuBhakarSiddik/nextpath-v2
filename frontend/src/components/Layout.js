// frontend/src/components/Layout.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";

export default function Layout({ children, hideFooter = false }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#080c14",
        color: "#f8fafc",
      }}
    >
      <Navbar onOpenCommandPalette={setCommandPaletteOpen} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={setCommandPaletteOpen}
      />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
