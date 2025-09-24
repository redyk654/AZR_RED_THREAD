export const generateErrorMessage = (error: any): string => {
    let errorMessage = "Erreur réseau, impossible de contacter le serveur";
    
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return errorMessage;
}