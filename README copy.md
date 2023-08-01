# Description

Ash and his friends are on a new adventure to catch even more Pokemon! Before they set off on this journey they need
some tools. As we all know every great Pokemon trainer needs a reliable Pokedex to identify Pokemon. It’s a good thing
they requested Pokedexii! Now their pokedex is in the cloud!

## Running

```sh
docker run -p 5173:80 zthun/pokedex-web
# Open http://localhost:5173/ in the browser.
```

## Local Development

```sh
git clone https://github.com/zthun/pokedexii
cd pokedexii
yarn install
yarn workspace @zthun/pokedex-web start
# Open http://localhost:5173 in the browser.
```

## Road Map

- Adding details when a Pokemon is selected
- Adding search history to recall past searches
- Adding e2e tests
- Adding a personal backend for better caching of Pokemon in accordance with the Pokemon API. (Onion)
- Adding item and machine lists.
- Adding images for pokemon that do not exist.
