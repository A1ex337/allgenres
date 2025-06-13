# All Genres

This project provides a static website that visualizes music genres as an interactive tree. The site now contains dozens of styles so you can explore how they relate. Selecting a node loads a Spotify playlist for that genre in the embedded player.

## Usage

Open `public/index.html` in a web browser. Select a genre node to load its playlist. The Spotify player appears below the tree.

### Local server

Some browsers block embedded content when opened from the local filesystem. If
the player doesn't appear, serve the `public` folder using a lightweight web
server:

```bash
npx serve public
```

Open the browser console to view diagnostic logs when selecting genres.

## Development

Dependencies are managed with npm. To install D3 locally run:

```bash
npm install
```

### Generating genre data

A Node script can fetch genre information from the Discogs API and build a JSON tree.
Create a `.env` file from `.env.example` and provide your Discogs token, then run:

```bash
npm run build:genres
```

This outputs `genres.json` in the project root which can be used by the application.

