// src/components/shared/NavBar.tsx
"use client";

import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "@/utils/protectedRoute";

export default function NavBar() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header style={{ background: "#1b365f", padding: "10px", color: "#fff" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>RED THREAD</h3>
        {isAuthenticated ? (
          <Button onClick={logout} variant="contained" color="secondary">
            Se déconnecter
          </Button>
        ) : (
          <Button onClick={login} variant="contained" color="primary">
            Se connecter
          </Button>
        )}
      </nav>
    </header>
  );
}
