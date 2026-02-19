import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",
  async (params, thunkAPI) => {
    try {
      const { data } = await axios.get("/pokemon", { params });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed fetch",
      );
    }
  },
);

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    list: [],
    currentPage: 1,
    totalData: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalData = action.payload.totalData;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pokemonSlice.reducer;
