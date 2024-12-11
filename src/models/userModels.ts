export interface UserModel {
  email: string | null;
  phoneNumber?: string | null;
  firstName: string | null;
  lastName: string | null;
  firebaseId: string | null;
  id?: string;
  favourites?: string[];
}

export interface CreateUserModel {
  email: string;
  firstName: string;
  lastName: string;
  firebaseId: string;
  authProvider: string;
}
