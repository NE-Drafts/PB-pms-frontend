import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  userSlice: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

const persistor = persistStore(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <PersistGate persistor={persistor} loading={null}>
        <Provider store={store}>
          <App />
        </Provider>
      </PersistGate>
    </MantineProvider>
  </StrictMode>
);
