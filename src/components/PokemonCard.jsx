export default function PokemonCard({ pokemon, onCardClick, bookmarked, onAddBookmark }) {
  return (
    <div
      onClick={onCardClick}
      className="cursor-pointer bg-[#1e293b] border border-gray-700 rounded-2xl p-6
                 shadow-md hover:shadow-xl transition-shadow duration-300
                 flex flex-col items-center space-y-4"
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-linear-to-br from-white/5 to-black/10 blur-lg -z-10"></div>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="w-24 h-24 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h2 className="text-center text-gray-200 font-semibold text-lg tracking-wide capitalize">
        #{pokemon.id} {pokemon.name}
      </h2>

      <div className="flex gap-2 flex-wrap justify-center">
        {pokemon.types?.map((type) => (
          <span
            key={type}
            className="px-3 py-1 rounded-full text-xs uppercase bg-gray-800/50 border border-gray-600 backdrop-blur-sm"
          >
            {type}
          </span>
        ))}
      </div>

      <button
        disabled={bookmarked}
        onClick={(e) => {
          e.stopPropagation();
          onAddBookmark(pokemon.id);
        }}
        className={`mt-2 px-4 py-1 rounded font-semibold text-sm transition
          ${bookmarked 
            ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
            : "bg-cyan-400 text-black hover:scale-105 cursor-pointer"}`}
      >
        {bookmarked ? "Bookmarked" : "Add to Bookmark"}
      </button>
    </div>
  );
}
