import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pokemonReducer from "../features/pokemonSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pokemon: pokemonReducer,
  },
});

export default store;
