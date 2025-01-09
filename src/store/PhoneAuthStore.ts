import { Auth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { AuthProvider } from "@/constants/authProviders";
import { StorageKeys } from "@/constants/storageKeys";
import { UserStore } from "./UserStore";
import autoBind from "auto-bind";
import { makeAutoObservable } from "mobx";

export class PhoneAuthStore {
  recaptchaVerifier: RecaptchaVerifier | null = null;
  userStore: UserStore;

  constructor(userStore: UserStore) {
    this.userStore = userStore;
    makeAutoObservable(this);
    autoBind(this);
  }

  setupRecaptcha(auth: Auth, containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = 
        new RecaptchaVerifier(
            auth, 
            containerId, 
            {
                size: "invisible",
                callback: (response: any) => console.log("Recaptcha verified:", response),
            }
        );
    }
  }

  async sendOtp(auth: Auth, phoneNumber: string) {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error("Recaptcha not initialized.");
      }
      return await signInWithPhoneNumber(auth, phoneNumber, this.recaptchaVerifier);
    } catch (error) {
      console.error("OTP sending failed:", error);
      throw error;
    }
  }

  async verifyPhoneOtp(confirmationResult: any, verificationCode: string) {
      try {
        const userCredential = await confirmationResult.confirm(verificationCode);
        const token = await userCredential.user.getIdToken();
  
        if (token && typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
  
        const user = {
          email: userCredential.user.email || null,
          firstName: userCredential.user.displayName?.split(" ")[0] || null,
          lastName: userCredential.user.displayName?.split(" ")[1] || null,
          authProvider: AuthProvider.PHONE,
          firebaseId: userCredential.user.uid,
        };
  
        this.userStore.setCurrentUser(user);
      } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
      }
    }
}