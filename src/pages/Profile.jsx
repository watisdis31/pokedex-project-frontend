import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import instance from "../api/axios";

export default function UserProfile() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const limit = 10;
  const [teamSearch, setTeamSearch] = useState("");

  const fetchBookmarks = async (page = 1) => {
    try {
      setLoadingBookmarks(true);
      const { data } = await instance.get(`/bookmarks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const bookmarkPromises = data
        .slice((page - 1) * limit, page * limit)
        .map(async (b) => {
          try {
            const res = await instance.get(
              `https://pokeapi.co/api/v2/pokemon/${b.pokemonId}`,
            );
            return {
              id: b.pokemonId,
              name: res.data.name,
              sprite: res.data.sprites.front_default,
            };
          } catch {
            return {
              id: b.pokemonId,
              name: "Unknown",
              sprite: "/placeholder.png",
            };
          }
        });

      const bookmarkResults = await Promise.all(bookmarkPromises);
      setBookmarks(bookmarkResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async (page = 1, search = teamSearch) => {
    try {
      setLoadingTeams(true);

      const { data } = await instance.get(
        `/teams?page=${page}&limit=${limit}&search=${search || ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setTeams(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Team name is required",
      });
      return;
    }

    try {
      await instance.post("/teams", { name: teamName });

      Swal.fire({
        icon: "success",
        title: "Team created!",
        timer: 1200,
        showConfirmButton: false,
      });

      setTeamName("");
      fetchTeams();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to create team",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDeleteBookmark = async (pokemonId) => {
    try {
      await instance.delete(`/bookmarks/${pokemonId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      fetchBookmarks(bookmarkPage);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete bookmark",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    fetchBookmarks(bookmarkPage);
  }, [bookmarkPage]);

  useEffect(() => {
    fetchTeams(teamPage, teamSearch);
  }, [teamPage, teamSearch]);

  const handleDelete = async (teamId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This team will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await instance.delete(`/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Team deleted!",
        timer: 1200,
        showConfirmButton: false,
      });

      fetchTeams(teamPage);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete team",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center tracking-widest">
        Trainer Profile
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          Bookmarked Pokémon
        </h2>
        {loadingBookmarks ? (
          <p className="text-gray-400 animate-pulse text-center">
            Loading bookmarks...
          </p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center">No bookmarks yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/pokemon/${b.id}`)}
                className="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800 cursor-pointer hover:scale-105 transition shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center"
              >
                <img
                  src={b.sprite}
                  alt={b.name}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="text-center capitalize text-gray-200 font-semibold">
                  #{b.id} {b.name}
                </h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBookmark(b.id);
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={bookmarkPage === 1}
            onClick={() => setBookmarkPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
          >
            Prev
          </button>
          <span className="text-cyan-400 font-bold">Page {bookmarkPage}</span>
          <button
            disabled={bookmarks.length < limit}
            onClick={() => setBookmarkPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-400">My Teams</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search team name..."
            value={teamSearch}
            onChange={(e) => {
              setTeamSearch(e.target.value);
              setTeamPage(1);
            }}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700
               text-gray-200 focus:outline-none focus:border-green-400"
          />
        </div>

        <form
          onSubmit={handleCreateTeam}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Enter team name..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700
                 text-gray-200 focus:outline-none focus:border-gray-500"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold
                 hover:scale-105 transition cursor-pointer"
          >
            Create Team
          </button>
        </form>

        {loadingTeams ? (
          <p className="text-gray-400 animate-pulse text-center py-10">
            Loading teams...
          </p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No teams yet</p>
        ) : (
          <div className="space-y-5 mt-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {team.name}
                  </h3>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/teams/${team.id}`)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(team.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={teamPage === 1}
            onClick={() => setTeamPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
          >
            Prev
          </button>
          <span className="text-cyan-400 font-bold">Page {teamPage}</span>
          <button
            disabled={teams.length < limit}
            onClick={() => setTeamPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
