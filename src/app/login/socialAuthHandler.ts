import {
  Auth,
  AuthProvider as FirebaseAuthProvider,
  UserCredential,
  signInWithPopup,
} from "firebase/auth";

type UserApi = {
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (user: any) => Promise<any>;
};

type UserStore = {
  setCurrentUser: (user: any) => void;
};

function extractEmail(result: UserCredential): string | undefined {
  // 1) Primary email
  const primary = result.user?.email?.trim();
  if (primary) return primary;

  // 2) Try providerData fallbacks
  const fromProviderData = result.user?.providerData?.find(p => !!p.email)?.email?.trim();
  if (fromProviderData) return fromProviderData;

  // 3) (rare) token response may contain email for some providers
  const tokenEmail = (result as any)?._tokenResponse?.email?.trim();
  if (tokenEmail) return tokenEmail;

  return undefined;
}

export const handleSocialAuth = async (
  auth: Auth,
  provider: FirebaseAuthProvider,
  userApi: UserApi,
  userStore: UserStore,
  authProviderName: string
): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, provider);

    const providerId =
      (result as any)?.providerId ||
      (provider as any)?.providerId ||
      result.user?.providerData?.[0]?.providerId ||
      "unknown";

    const email = extractEmail(result);

    if (!email) {
      if (String(providerId).includes("yahoo")) {
        // Helpful hint specific to Yahoo
        throw new Error(
          "Autentificarea a eșuat: email-ul lipsește de la Yahoo. Adaugă scope-ul 'email' la OAuthProvider('yahoo.com') și permite partajarea emailului în contul Yahoo."
        );
      }
      throw new Error("Autentificarea a eșuat: email-ul este obligatoriu.");
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
    if (!userByEmail) {
      userByEmail = await userApi.createUser(userModel);
    }
    if (!userByEmail) {
      throw new Error("Autentificarea a eșuat: utilizatorul nu a putut fi creat sau recuperat.");
    }

    userStore.setCurrentUser(userByEmail);
  } catch (error: any) {
    if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
      throw error; // let caller handle silently
    }
    console.error(`${authProviderName} login failed:`, error);
    throw error;
  }
};