export const getFirebaseAuthErrorMessage = (error) => {
  if (!error || typeof error !== "object") {
    return "Authentication failed. Please try again.";
  }

  switch (error.code) {
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    case "auth/invalid-api-key":
      return "Firebase configuration error.";

    case "auth/unauthorized-domain":
      return "Unauthorized domain for Google authentication.";

    case "auth/account-exists-with-different-credential":
      return "Account already exists with another sign-in method.";

    default:
      return error.message || "Google authentication failed.";
  }
};
