# All Genres

This project provides a simple static website that visualizes music genres as a tree. Clicking on a genre loads a Spotify playlist with representative tracks of that genre.

## Usage

Open `public/index.html` in a web browser. The page contains an interactive tree. Select a genre node to play a Spotify playlist in the embedded player below the tree.

## Development

Dependencies are managed with npm. To install D3 locally run:

```bash
npm install
```

D3's bundled file is copied from `node_modules` into `public/d3.min.js`.
