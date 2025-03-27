import { storeContext } from "@/context/storeContext";
import { useContext } from "react";

export const useStore = () => useContext(storeContext);
