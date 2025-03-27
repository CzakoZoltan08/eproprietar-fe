import AppStore from "../store/AppStore";
import { createContext } from "react";

let store: AppStore;

function initializeStore() {
  const _store = store ?? new AppStore();

  if (typeof window === "undefined") return _store;
  if (!store) store = _store;

  return _store;
}

export const storeContext = createContext<AppStore>(initializeStore());