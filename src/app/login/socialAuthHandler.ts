import { StorageKeys } from "@/constants/storageKeys";
import { signInWithPopup } from "firebase/auth";

export const handleSocialAuth = async (
  auth: any,
  provider: any,
  userApi: any,
  userStore: any,
  authProviderName: string
) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user?.getIdToken();

    if (token && typeof window !== "undefined") {
      localStorage.setItem(StorageKeys.token, token);
    }

    const userModel = {
      email: result.user.email || "",
      firstName: result.user.displayName?.split(" ")[0] || "",
      lastName: result.user.displayName?.split(" ")[1] || "",
      firebaseId: result.user.uid,
      authProvider: authProviderName,
    };

    userStore.setCurrentUser(userModel);

    if (result.user.email) {
      const userByEmail = await userApi.getUserByEmail(result.user.email);
      if (!userByEmail) {
        await userApi.createUser(userModel);
      }
    }
  } catch (error) {
    console.error(`${authProviderName} login failed:`, error);
    throw error;
  }
};