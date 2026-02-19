# 📘 Pokedex Project Frontend Documentation

Website live URL: **https://pokedex-project-frontend.vercel.app**  

---

## 🧱 Overview

This is a **React + Vite** frontend application that acts as a Pokédex interface — displaying Pokémon data fetched from the **PokéAPI (https://pokeapi.co)**. Users can view Pokémon lists, search by name, and see details like sprites and stats in an interactive UI.

The project uses **Vite** as the build tool and React for component UI. It’s purely a frontend; all data comes from external APIs.

---

## 🛠️ Tech Stack

- React (UI library)  
- Vite (build tool & dev server)  
- JavaScript / JSX  
- CSS or Tailwind  
- Data fetched from **PokéAPI** (public REST API)

---

## 🚀 Features

✔ Browse a list of Pokémon  
✔ Search Pokémon by name  
✔ View Pokémon details (image, ID, stats, types)  
✔ Responsive UI for web browsers  
✔ Fast loading with Vite setup

---


- `src/components/` – Reusable UI components  
- `src/pages/` – Page views (Home, Detail)  
- `src/services/` – API fetch utilities  
- `App.jsx` – Root React component  
- `main.jsx` – App bootstrap with Vite  

---

## 🌐 API Integration

This frontend fetches data from the **PokéAPI** — a free public REST Pokémon database.

### Example Fetch Endpoints

| Purpose | HTTP Method | External API Endpoint |
|---------|-------------|---------------------|
| Get list of Pokémon | GET | `https://pokeapi.co/api/v2/pokemon?limit=...` |
| Get details for one Pokémon | GET | `https://pokeapi.co/api/v2/pokemon/{id or name}` |
| Get Pokémon species | GET | `https://pokeapi.co/api/v2/pokemon-species/{id}` |
| Get type info | GET | `https://pokeapi.co/api/v2/type/{typeName}` |

### How Data is Used

- **Pokémon List:** Loads a batch of Pokémon with their name & sprite  
- **Detail Page:** Fetches full stats (types, abilities, base stats) when a card is clicked  
- **Search:** Filters Pokémon by user input  
- **Pagination / Infinite Scroll:** Loads more Pokémon when scrolling or via next/prev buttons  

### Example Data Format

#### Pokémon List JSON
```json
{
  "count": 1281,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
    ...
  ]
}
```

#### Pokémon Detail JSON
```json
{
  "id": 1,
  "name": "bulbasaur",
  "sprites": {
    "front_default": "https://..."
  },
  "types": [
    { "type": { "name": "grass" } },
    { "type": { "name": "poison" } }
  ],
  "stats": [
    { "base_stat": 45, "stat": { "name": "hp" } },
    ...
  ]
}
```
