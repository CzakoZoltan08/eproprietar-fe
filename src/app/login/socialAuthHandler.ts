import {
  Auth,
  AuthProvider as FirebaseAuthProvider,
  UserCredential,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

type UserApi = {
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (user: any) => Promise<any>;
};

type UserStore = {
  setCurrentUser: (user: any) => void;
};

// ---- helpers ----
function extractEmail(result: UserCredential): string | undefined {
  const primary = result.user?.email?.trim();
  if (primary) return primary;

  const fromProviderData = result.user?.providerData?.find(p => !!p.email)?.email?.trim();
  if (fromProviderData) return fromProviderData;

  const tokenEmail = (result as any)?._tokenResponse?.email?.trim();
  if (tokenEmail) return tokenEmail;

  return undefined;
}

async function finalizeUser(
  result: UserCredential,
  userApi: UserApi,
  userStore: UserStore,
  authProviderName: string
): Promise<void> {
  const providerId =
    (result as any)?.providerId ||
    result.user?.providerData?.[0]?.providerId ||
    "unknown";

  const email = extractEmail(result);
  if (!email) {
    if (String(providerId).includes("yahoo")) {
      const err: any = new Error(
        "Autentificarea a eșuat: email-ul lipsește de la Yahoo. Te rugăm să permiți partajarea emailului."
      );
      err.code = "auth/yahoo-missing-email";
      throw err;
    }
    const err: any = new Error("Autentificarea a eșuat: email-ul este obligatoriu.");
    err.code = "auth/missing-email";
    throw err;
  }

  const fullName = result.user.displayName?.trim() || "";
  const [firstName = "", ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  const userModel = {
    email,
    firstName,
    lastName,
    firebaseId: result.user.uid,
    authProvider: authProviderName,
    role: "user",
  };

  let userByEmail = await userApi.getUserByEmail(email);
  if (!userByEmail) userByEmail = await userApi.createUser(userModel);
  if (!userByEmail) {
    const err: any = new Error(
      "Autentificarea a eșuat: utilizatorul nu a putut fi creat sau recuperat."
    );
    err.code = "auth/backend-user-failure";
    throw err;
  }

  userStore.setCurrentUser(userByEmail);
}

// ---- public API ----

// 1) Try popup; if it fails due to popup being blocked/closed, fall back to redirect
export async function startSocialAuth(
  auth: Auth,
  provider: FirebaseAuthProvider,
  userApi: UserApi,
  userStore: UserStore,
  authProviderName: string
): Promise<"popup" | "redirect"> {
  try {
    const result = await signInWithPopup(auth, provider);
    await finalizeUser(result, userApi, userStore, authProviderName);
    return "popup";
  } catch (error: any) {
    // If popup is blocked/auto-closed, use redirect
    const code = error?.code || "";
    const popupIssue =
      code === "auth/popup-closed-by-user" ||
      code === "auth/popup-blocked" ||
      code === "auth/cancelled-popup-request";

    if (popupIssue) {
      // mark that we’re going into redirect flow
      if (typeof window !== "undefined") {
        sessionStorage.setItem("SOCIAL_REDIRECT_PENDING", "1");
        sessionStorage.setItem("SOCIAL_REDIRECT_PROVIDER", authProviderName);
      }
      await signInWithRedirect(auth, provider);
      // browser navigates away here
      return "redirect";
    }

    // Other errors: bubble up
    console.error(`${authProviderName} login failed:`, error);
    throw error;
  }
}

// 2) Complete redirect if coming back from provider
export async function completeRedirectIfNeeded(
  auth: Auth,
  userApi: UserApi,
  userStore: UserStore
): Promise<boolean> {
  // Only try if we marked a redirect previously
  const pending = typeof window !== "undefined" && sessionStorage.getItem("SOCIAL_REDIRECT_PENDING") === "1";
  const authProviderName = (typeof window !== "undefined" && sessionStorage.getItem("SOCIAL_REDIRECT_PROVIDER")) || "unknown";

  try {
    const result = await getRedirectResult(auth);
    if (!result) {
      // Nothing to complete
      return false;
    }

    await finalizeUser(result, userApi, userStore, authProviderName);
    return true;
  } finally {
    // Always clear flags
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("SOCIAL_REDIRECT_PENDING");
      sessionStorage.removeItem("SOCIAL_REDIRECT_PROVIDER");
    }
  }
}