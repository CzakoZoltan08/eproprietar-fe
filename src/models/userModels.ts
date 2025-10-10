export interface UserModel {
  email: string | null;
  phoneNumber?: string | null;
  firstName: string | null;
  lastName: string | null;
  firebaseId: string | null;
  id?: string;
  favourites?: string[];
  role: string;
  authProvider: string; // ✅ add this
}

export interface CreateUserModel {
  email: string;
  firstName: string;
  lastName: string;
  firebaseId: string;
  authProvider: string;
}

export interface CreateFirebaseUserModel {
  email: string;
  firstName: string;
  lastName: string;
}