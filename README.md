# All Genres

This project provides a static website that visualizes music genres as an interactive tree. The site now contains dozens of styles so you can explore how they relate. Selecting a node loads a Spotify playlist for that genre in the embedded player.

## Usage

Open `public/index.html` in a web browser. Select a genre node to load music. The Spotify player sits in a slim bar at the bottom of the page so the genre map can fill the screen. If the genre does not have an associated playlist the app will automatically search Spotify for that term.

### Local server

Some browsers block embedded content when opened from the local filesystem. If
the player doesn't appear, serve the `public` folder using a lightweight web
server:

```bash
npx serve public
```

Open the browser console to view diagnostic logs when selecting genres. These logs indicate when the player fails to load or search results cannot be played.

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

The script automatically iterates through all available pages so the resulting `genres.json` can contain thousands of entries. This file can then be loaded by the website.

