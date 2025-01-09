import { Auth, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { CreateUserModel, UserModel } from "@/models/userModels";
import { ErrorMessages, FirebaseErrors } from "@/constants/FirebaseErrors";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { AuthApi } from "@/api/AuthApi";
import { AuthProvider } from "@/constants/authProviders";
import { FacebookAuthProvider } from "firebase/auth";
import { StorageKeys } from "@/constants/storageKeys";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { auth } from "@/config/firebase";
import autoBind from "auto-bind";

export class AuthStore {
  authApi: AuthApi;
  userApi: UserApi;
  userStore: UserStore;
  accessToken: any = null;
  errorMessage: string = "";
  errors: any = {
    emailAlreadyInUse: false,
    invalidEmailAddress: false,
    wrongPassword: false,
  };
  loading: boolean = false;

  constructor(authApi: AuthApi, userApi: UserApi, userStore: UserStore) {
    this.authApi = authApi;
    this.userApi = userApi;
    this.userStore = userStore;

    makeAutoObservable(this);
    autoBind(this);
  }

  getAccessToken() {
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem(StorageKeys.token);

      runInAction(() => {
        this.accessToken = currentToken;
      });
    }
  }

  resetErrors() {
    this.errors = {
      emailAlreadyInUse: false,
      invalidEmailAddress: false,
      wrongPassword: false,
    };
  }

  async registerWithEmailAndPassword(email: string, password: string, firstName: string, lastName: string) {
    this.errorMessage = ""; // Clear previous errors
    this.resetErrors(); // Reset specific error flags
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Optionally, update the user's display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
  
      const token = await user.getIdToken();
  
      if (token && typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.token, token); // Save token locally
      }
  
      // Set authenticated user data
      const userModel: CreateUserModel = {
        email: user.email || "",
        firstName,
        lastName,
        firebaseId: user.uid,
        authProvider: AuthProvider.EMAIL, // Set the auth provider
      };
  
      // Save the user to the backend if needed
      await this.userApi.createUser(userModel);
  
      runInAction(() => {
        this.userStore.setCurrentUser(userModel);
        this.accessToken = token;
      });
  
      console.log("User successfully registered!");
    } catch (error: any) {
      console.error("Registration failed:", error);
  
      runInAction(() => {
        this.loading = false;
  
        // Map Firebase errors to user-friendly messages
        if (error.code === FirebaseErrors.EmailAlreadyInUse) {
          this.errors.emailAlreadyInUse = true;
          this.errorMessage = ErrorMessages.EmailAlreadyInUse;
        } else if (error.code === FirebaseErrors.InvalidEmail) {
          this.errors.invalidEmailAddress = true;
          this.errorMessage = ErrorMessages.InvalidEmailAddress;
        } else {
          this.errorMessage = "An unexpected error occurred during registration.";
        }
      });
  
      throw new Error(this.errorMessage); // Throw error for the component to catch
    }
  }

  async loginWithGoogle(provider: GoogleAuthProvider, doRegister = true) {
    try {
      const result = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = await result.user?.getIdToken();
      const firstName = result?.user?.displayName
        ?.split(" ")
        .slice(0, -1)
        .join(" ");
      const lastName = result?.user?.displayName
        ?.split(" ")
        .slice(-1)
        .join(" ");

      if (token && result.user?.email) {
        if (typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
        runInAction(() => {
          this.accessToken = token;
        });

        const user = {
          email: result.user.email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: AuthProvider.GOOGLE,
          firebaseId: result?.user?.uid,
        };

        this.userStore.setCurrentUser(user);

        const userByEmail = await this.userApi.getUserByEmail(
          result.user?.email,
        );

        if (doRegister || !userByEmail) {
          const email = result?.user?.email;
          const uid = result?.user?.uid;
        
          // Validate required fields before proceeding
          if (!email || !uid) {
            throw new Error("Invalid user data: email and firebaseId are required");
          }
        
          const payload: CreateUserModel = {
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            authProvider: AuthProvider.GOOGLE,
            firebaseId: uid
          }

          await this.userApi.createUser(payload);
        }
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = await result.user?.getIdToken();
      const firstName = result?.user?.displayName
        ?.split(" ")
        .slice(0, -1)
        .join(" ");
      const lastName = result?.user?.displayName
        ?.split(" ")
        .slice(-1)
        .join(" ");

      if (token && result.user?.email) {
        if (typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
        runInAction(() => {
          this.accessToken = token;
        });

        const user = {
          email: result.user.email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: AuthProvider.FACEBOOK,
          firebaseId: result?.user?.uid,
        };

        this.userStore.setCurrentUser(user);

        const userByEmail = await this.userApi.getUserByEmail(
          result.user?.email,
        );

        if (!userByEmail) {
          const email = result?.user?.email;
          const uid = result?.user?.uid;

          // Validate required fields before proceeding
          if (!email || !uid) {
            throw new Error("Invalid user data: email and firebaseId are required");
          }

          const payload: CreateUserModel = {
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            authProvider: AuthProvider.FACEBOOK,
            firebaseId: uid,
          };

          await this.userApi.createUser(payload);
        }
      }
    } catch (e) {
      console.log("Error: ", e);
      runInAction(() => {
        this.errorMessage = "Failed to log in with Facebook.";
      });
    }
  }

  async loginWithYahoo() {
    const yahooProvider = new OAuthProvider("yahoo.com");

    try {
      // Sign in with Yahoo
      const result = await signInWithPopup(auth, yahooProvider);

      // Get the OAuth token and user details
      const token = await result.user?.getIdToken();
      const firstName = result.user?.displayName?.split(" ").slice(0, -1).join(" ");
      const lastName = result.user?.displayName?.split(" ").slice(-1).join(" ");

      if (token && result.user?.email) {
        if (typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
        runInAction(() => {
          this.accessToken = token;
        });

        const user = {
          email: result.user.email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: AuthProvider.YAHOO,
          firebaseId: result.user.uid,
        };

        this.userStore.setCurrentUser(user);

        const userByEmail = await this.userApi.getUserByEmail(result.user.email);

        if (!userByEmail) {
          const payload: CreateUserModel = {
            email: result.user.email,
            firstName: firstName || "",
            lastName: lastName || "",
            authProvider: AuthProvider.YAHOO,
            firebaseId: result.user.uid,
          };

          await this.userApi.createUser(payload);
        }
      }
    } catch (error) {
      console.error("Error logging in with Yahoo:", error);
      runInAction(() => {
        this.errorMessage = "Failed to log in with Yahoo.";
      });
    }
  }

  async signInEmailAndPassword(email: string, password: string) {
    this.errorMessage = ""; // Reset error message
    this.resetErrors(); // Reset specific error flags
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
  
      if (token && typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.token, token); // Save token locally
      }
  
      // Set authenticated user data
      const userModel: UserModel = {
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        firebaseId: user.uid,
        email: user.email || "",
      };
  
      runInAction(() => {
        this.userStore.setCurrentUser(userModel);
        this.accessToken = token;
      });
  
      console.log("User successfully logged in!");
    } catch (error: any) {
      console.error("Login failed:", error);
  
      runInAction(() => {
        this.loading = false;
  
        // Map Firebase errors to user-friendly messages
        if (error.code === FirebaseErrors.InvalidEmail) {
          this.errors.invalidEmailAddress = true;
          this.errorMessage = ErrorMessages.InvalidEmailAddress;
        } else if (error.code === FirebaseErrors.WrongPassword) {
          this.errors.wrongPassword = true;
          this.errorMessage = ErrorMessages.WrongPassword;
        } else if (error.code === FirebaseErrors.UserNotFound) {
          this.errors.wrongPassword = true;
          this.errorMessage = ErrorMessages.UserNotFound;
        } else {
          this.errorMessage = "An unexpected error occurred.";
        }
      });
  
      throw new Error(this.errorMessage); // Throw error for the component to catch
    }
  }

  async logout() {
    signOut(auth).then(() => console.log("User signed out!"));

    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }

  async resetPassword(email: string) {
    const userByEmail = await this.userApi.getUserByEmail(email);

    if (!userByEmail) {
      runInAction(() => {
        this.loading = false;

        this.errorMessage =
          "Nu exista cont cu aceasta adresa de email. Va rugam sa va inregistrati!";
      });
      return;
    }

    if (userByEmail.authProvider !== "email") {
      runInAction(() => {
        this.loading = false;

        this.errorMessage =
          "Numai userii autentificati cu email si parola isi pot schimba parola";
      });
      return;
    }

    return sendPasswordResetEmail(auth, email)
      .then((a) => {
        alert(
          "Emailul pentru resetarea parolei a fost trimis la aceasta adresa",
        );
      })
      .catch((error: any) => {
        runInAction(() => {
          this.loading = false;

          this.errorMessage = error.message;
        });
        console.log("resetPassword error", error);
      });
  }

  recaptchaVerifier: RecaptchaVerifier | null = null;

  async setupRecaptcha(auth: Auth, containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(
        auth, // Pass the Auth instance here
        containerId, // Container ID or HTMLElement
        {
          size: "invisible", // Options for RecaptchaVerifier
          callback: (response: any) => {
            console.log("Recaptcha verified:", response);
          },
          "expired-callback": () => {
            console.error("Recaptcha expired. Please try again.");
          },
        }
      );
    }
  }

  async sendPhoneOtp(auth: Auth, phoneNumber: string) {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error("RecaptchaVerifier is not set up.");
      }

      console.log("Sending OTP to", phoneNumber);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
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
