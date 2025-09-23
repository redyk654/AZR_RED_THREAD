// src/pages/Authentification/Connect.tsx
"use client";

import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { msalInstance, loginRequest } from "@/utils/msalConfig";

/**
 * Page simple qui propose un bouton login (utiliser si tu veux login déclenché manuellement)
 */
export default function Connect() {
  const handleLogin = async () => {
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      <Button variant="contained" onClick={handleLogin} sx={{ bgcolor: "#1b365f", color: "#fff" }}>
        Se connecter avec Azure AD
      </Button>
    </Box>
  );
}
