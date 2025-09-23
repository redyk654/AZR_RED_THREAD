// src/pages/Authentification/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

/**
 * Formulaire local de fallback (n'effectue pas de vrai login MSAL).
 * Peut servir pour des environnements tests/preview.
 */
export default function LoginForm({ onLocalLogin }: { onLocalLogin?: (email: string) => void }) {
  const [email, setEmail] = useState("");

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8 }}>
      <Typography variant="h6">Connexion (fallback)</Typography>
      <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
      <Button
        fullWidth
        variant="contained"
        sx={{ bgcolor: "#1b365f", color: "#fff" }}
        onClick={() => onLocalLogin?.(email)}
      >
        Se connecter (local)
      </Button>
    </Box>
  );
}
