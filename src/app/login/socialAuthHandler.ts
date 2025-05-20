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

    // Ensure that email is not empty
    const email = result.user.email?.trim();
    if (!email) {
      throw new Error("Login failed: Email is required.");
    }

    // Create user model
    const userModel = {
      email,
      firstName: result.user.displayName?.split(" ")[0] || "",
      lastName: result.user.displayName?.split(" ")[1] || "",
      firebaseId: result.user.uid,
      authProvider: authProviderName,
      role: "user"
    };

    // Retrieve or create user
    let userByEmail = await userApi.getUserByEmail(email);
    if (!userByEmail) {
      userByEmail = await userApi.createUser(userModel);
    }

    // Ensure user was successfully created or retrieved
    if (!userByEmail) {
      // Remove token since user could not be created/retrieved
      throw new Error("Login failed: User could not be created or retrieved.");
    }

    // Set user in store
    userStore.setCurrentUser(userByEmail);

  } catch (error) {
    console.error(`${authProviderName} login failed:`, error);

    throw error;
  }
};