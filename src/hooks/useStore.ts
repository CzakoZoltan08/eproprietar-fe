import { useContext } from "react";

import { storeContext } from "@/context/storeContext";

export const useStore = () => useContext(storeContext);
