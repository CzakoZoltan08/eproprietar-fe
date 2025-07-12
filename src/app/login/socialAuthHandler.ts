import { Auth, AuthProvider, signInWithPopup } from "firebase/auth";

import { StorageKeys } from "@/constants/storageKeys";

type UserApi = {
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (user: any) => Promise<any>;
};

type UserStore = {
  setCurrentUser: (user: any) => void;
};

export const handleSocialAuth = async (
  auth: Auth,
  provider: AuthProvider,
  userApi: UserApi,
  userStore: UserStore,
  authProviderName: string
): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email?.trim();

    if (!email) {
      throw new Error("Autentificarea a eșuat: email-ul este obligatoriu.");
    }

    const fullName = result.user.displayName || "";
    const [firstName = "", ...rest] = fullName.trim().split(" ");
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
  } catch (error) {
    console.error(`${authProviderName} login failed:`, error);
    throw error;
  }
};