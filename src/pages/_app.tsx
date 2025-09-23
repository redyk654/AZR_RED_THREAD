import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/utils/msalConfig";
import { AuthProvider } from "@/utils/protectedRoute";
import { PermissionProvider } from "@/utils/accesPermition/permissionContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; // adapte si ton store est ailleurs
import { setupAxiosInterceptor } from "@/redux/config";

function MyApp({ Component, pageProps }: AppProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initMsal() {
      try {
        await msalInstance.initialize(); // 🔑 très important !
        setupAxiosInterceptor(msalInstance, ["User.Read"]);
        setInitialized(true);
      } catch (err) {
        console.error("Erreur MSAL init:", err);
      }
    }
    initMsal();
  }, []);

  if (!initialized) {
    return <div>Chargement de l’application...</div>; // évite d’appeler MSAL avant init
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <PermissionProvider>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </PermissionProvider>
      </AuthProvider>
    </MsalProvider>
  );
}

export default MyApp;
