import { createContext } from 'react';

import AppStore from '../store/AppStore';

export const storeContext = createContext<AppStore>(new AppStore());
