import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import instance from "../api/axios";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [team, setTeam] = useState({
    pokemons: [],
  });

  async function fetchTeamDetail() {
    try {
      const { data } = await instance.get(`/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setTeam(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTeamDetail();
  }, []);

  async function handleRemove(pokemonId) {
    try {
      await instance.delete(`/teams/${id}/pokemon/${pokemonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTeamDetail();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTeam() {
    try {
      await instance.delete(`/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }

  if (!team) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-400 tracking-wide">
            {team.name}
          </h2>
          <p className="text-gray-400 mt-2">
            Total Pokémon:{" "}
            <span className="text-cyan-400 font-semibold">
              {team.totalPokemon ?? team.pokemons.length}/6
            </span>
          </p>
        </div>

        <button
          onClick={handleDeleteTeam}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition cursor-pointer"
        >
          Delete Team
        </button>
      </div>

      {team.pokemons.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No Pokémon in this team yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.pokemons.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/pokemon/${p.id}`)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 
                 shadow-[0_0_20px_rgba(0,0,0,0.5)] 
                 hover:scale-105 transition cursor-pointer"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                alt={p.name}
                className="w-28 h-28 mx-auto mb-4"
              />

              <h4 className="text-xl font-semibold capitalize text-yellow-400 text-center mb-2">
                {p.name}
              </h4>

              <p className="text-gray-400 text-center mb-4">
                <span className="text-cyan-400 capitalize">
                  {p.types.join(", ")}
                </span>
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(p.id);
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
