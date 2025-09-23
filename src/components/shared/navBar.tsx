// src/components/shared/navBar.tsx
"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useMsal } from "@azure/msal-react";
import { msalInstance } from "@/utils/msalConfig";

/**
 * Navbar qui affiche le nom de l'utilisateur et un bouton logout.
 * Utilise msalInstance pour logoutRedirect.
 */
export default function NavBar({ userName, userEmail }: { userName?: string | null; userEmail?: string | null }) {
  const { instance, accounts } = useMsal();
  const account = accounts?.[0];

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1b365f" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          RED THREAD
        </Typography>

        <Box sx={{ textAlign: "right", mr: 2 }}>
          <Typography variant="body2">{userName ?? account?.name ?? "Invité"}</Typography>
          <Typography variant="caption" display="block">{userEmail ?? account?.username}</Typography>
        </Box>

        <Button color="inherit" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </Toolbar>
    </AppBar>
  );
}
