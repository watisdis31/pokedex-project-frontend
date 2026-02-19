import { useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../api/axios";
import Swal from "sweetalert2";

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const token = localStorage.getItem("access_token");

  async function fetchDetail() {
    try {
      const { data } = await instance.get(`/pokemon/${id}`);
      setPokemon(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeams() {
    try {
      const { data } = await instance.get("/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDetail();
    fetchTeams();
  }, [id]);

  async function handleAddToTeam(teamId) {
    try {
      await instance.post(
        `/teams/${teamId}/pokemon`,
        { pokemonId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Pokemon added to team successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400 text-lg">
        Loading Pokémon...
      </div>
    );

  if (!pokemon)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400 text-lg">
        Pokémon Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 px-12 py-20">
      <div className="max-w-7xl mx-auto space-y-32">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative flex justify-center">
            <div className="absolute w-105 h-105 rounded-full bg-linear-to-br from-white/5 to-white/0 blur-3xl"></div>

            <img
              src={pokemon.mainSprite || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-95 object-contain relative z-10 transition duration-500 hover:scale-[1.03]"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-7xl font-semibold tracking-tight uppercase">
                {pokemon.name}
              </h1>
              <p className="text-gray-500 text-xl mt-4">
                #{pokemon.id.toString().padStart(3, "0")}
              </p>
            </div>

            <div className="flex gap-4">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="px-6 py-2 rounded-full text-sm tracking-wide uppercase bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <h2 className="text-3xl font-medium tracking-wide">Base Stats</h2>

          <div className="space-y-6">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="space-y-2">
                <div className="flex justify-between text-sm uppercase tracking-wide text-gray-400">
                  <span>{stat.name}</span>
                  <span>{stat.baseStat}</span>
                </div>

                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-white/40 to-white/70 transition-all duration-700"
                    style={{
                      width: `${(Math.min(stat.baseStat, 255) / 255) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <h2 className="text-3xl font-medium tracking-wide">Evolution Line</h2>

          <div className="relative flex justify-between items-center">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -z-10"></div>

            {pokemon.evolutionLine.map((evo) => (
              <div
                key={evo.name}
                className="flex flex-col items-center bg-[#0a0a0f] px-10"
              >
                <img
                  src={evo.sprite}
                  alt={evo.name}
                  className="w-32 object-contain transition duration-300 hover:scale-110"
                />

                <span className="mt-4 uppercase tracking-wide">{evo.name}</span>

                {evo.level && (
                  <span className="text-sm text-gray-500 mt-1">
                    Level {evo.level}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {(pokemon.megaForms.length > 0 ||
          pokemon.gigantamaxForms.length > 0) && (
          <section className="space-y-12">
            <h2 className="text-3xl font-medium tracking-wide">
              Special Forms
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
              {[...pokemon.megaForms, ...pokemon.gigantamaxForms].map(
                (form) => (
                  <div
                    key={form.name}
                    className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition duration-500 hover:bg-white/10 hover:-translate-y-2"
                  >
                    <img
                      src={form.sprite}
                      alt={form.name}
                      className="w-28 mx-auto object-contain transition duration-300 group-hover:scale-110"
                    />
                    <p className="text-center mt-6 uppercase tracking-wide text-sm">
                      {form.name}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-8">
            <h2 className="text-3xl font-medium tracking-wide">
              Competitive Build
            </h2>

            <div className="space-y-4 text-gray-400">
              <p>
                <span className="text-gray-200">Role:</span>{" "}
                {pokemon.recommendation.role}
              </p>
              <p>
                <span className="text-gray-200">Nature:</span>{" "}
                {pokemon.recommendation.nature}
              </p>

              {pokemon.recommendation.suggestedMoves.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-gray-200 uppercase text-sm tracking-wide">
                    Suggested Moves
                  </p>
                  {pokemon.recommendation.suggestedMoves.map((move) => (
                    <p key={move}>• {move}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          {pokemon.card && (
            <div className="space-y-8">
              <h2 className="text-3xl font-medium tracking-wide">TCG Card</h2>

              <div className="transition duration-500 hover:scale-[1.03]">
                <img
                  src={pokemon.card.image}
                  alt={pokemon.card.name}
                  className="w-80 object-contain"
                />
              </div>

              <div className="text-gray-500">
                <p>{pokemon.card.name}</p>
                <p>HP: {pokemon.card.hp}</p>
                <p>Rarity: {pokemon.card.rarity}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 tracking-wide">
          Add To Team
        </h3>

        {teams.length === 0 ? (
          <p className="text-gray-500 italic">You don’t have any teams yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleAddToTeam(team.id)}
                className="
            bg-[#1a1a1a]
            border border-gray-800
            rounded-xl
            px-5 py-3
            text-gray-200
            font-semibold
            transition
            hover:border-cyan-400
            hover:text-cyan-400
            hover:scale-105
            shadow-[0_0_10px_rgba(0,0,0,0.5)]
            cursor-pointer
          "
              >
                Add to {team.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
