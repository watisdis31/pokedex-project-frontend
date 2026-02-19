import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemons } from "../features/pokemonSlice";
import PokemonCard from "../components/PokemonCard";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import instance from "../api/axios";


export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list = [],
    loading,
    totalData = 0,
    error,
  } = useSelector((state) => state.pokemon);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [generation, setGeneration] = useState("");
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [bookmarks, setBookmarks] = useState([]);

  const limit = 20;
  const totalPages = Math.ceil(totalData / limit);
  const typeQuery = type1 && type2 ? `${type1},${type2}` : type1 || type2 || "";

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await instance.get("/bookmarks");
        setBookmarks(data.map((b) => b.pokemonId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookmarks();
  }, []);

  const handleAddBookmark = async (pokemonId) => {
    try {
      await instance.post("/bookmarks", { pokemonId });
      Swal.fire({
        icon: "success",
        title: "Pokemon bookmarked!",
        showConfirmButton: false,
        timer: 1200,
      });
      setBookmarks((prev) => [...prev, pokemonId]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to bookmark",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      fetchPokemons({
        page,
        limit,
        search: debouncedSearch,
        generation,
        type: typeQuery,
      }),
    );
  }, [dispatch, page, debouncedSearch, generation, typeQuery]);

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6">
      <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-3xl p-6 shadow-lg mb-6 border border-gray-700">
        <h1 className="text-4xl font-bold tracking-widest text-gray-200 uppercase">
          Pokédex Database
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Scan, explore, and analyze Pokémon data
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700
                     placeholder-gray-500 text-gray-100 focus:outline-none
                     focus:border-gray-500 transition"
        />

        <select
          value={generation}
          onChange={(e) => {
            setPage(1);
            setGeneration(e.target.value);
          }}
          className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200"
        >
          <option value="">All Generations</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
            <option key={g} value={g}>
              Generation {g}
            </option>
          ))}
        </select>

        <select
          value={type1}
          onChange={(e) => {
            setPage(1);
            setType1(e.target.value);
          }}
          className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200"
        >
          <option value="">Type 1</option>
          {[
            "normal",
            "fire",
            "water",
            "electric",
            "grass",
            "ice",
            "fighting",
            "poison",
            "ground",
            "flying",
            "psychic",
            "bug",
            "rock",
            "ghost",
            "dragon",
            "dark",
            "steel",
            "fairy",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={type2}
          onChange={(e) => {
            setPage(1);
            setType2(e.target.value);
          }}
          className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200"
        >
          <option value="">Type 2 (Optional)</option>
          {[
            "normal",
            "fire",
            "water",
            "electric",
            "grass",
            "ice",
            "fighting",
            "poison",
            "ground",
            "flying",
            "psychic",
            "bug",
            "rock",
            "ghost",
            "dragon",
            "dark",
            "steel",
            "fairy",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Scanning Pokémon...
        </p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500">No Pokémon found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {list.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onCardClick={() => navigate(`/pokemon/${pokemon.id}`)}
              bookmarked={bookmarks.includes(pokemon.id)}
              onAddBookmark={handleAddBookmark}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-5 py-2 rounded-xl bg-gray-800 border border-gray-700
                     disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
        >
          Prev
        </button>

        <span className="text-gray-200 font-semibold">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-5 py-2 rounded-xl bg-gray-800 border border-gray-700
                     disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
