// build-genres.js
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;
const SPOTIFY_TEMPLATE_ID = 'YOUR_SPOTIFY_TEMPLATE_ID';

async function fetchDiscogs(path) {
  const res = await fetch(`https://api.discogs.com/${path}&per_page=100&page=1`, {
    headers: { 'Authorization': `Discogs token=${DISCOGS_TOKEN}` }
  });
  if (!res.ok) {
    throw new Error(`Discogs request failed: ${res.status}`);
  }
  return res.json();
}

async function main() {
  const genres = await fetchDiscogs('database/genres?token=' + DISCOGS_TOKEN);
  const styles = await fetchDiscogs('database/styles?token=' + DISCOGS_TOKEN);

  const subgenresMap = {};
  for (const style of styles.results) {
    for (const parent of style.genre) {
      if (!subgenresMap[parent]) subgenresMap[parent] = [];
      subgenresMap[parent].push({
        name: style.name,
        description: style.id ? `Discogs style #${style.id}` : '',
        playlistUrl: `https://open.spotify.com/playlist/${SPOTIFY_TEMPLATE_ID}`,
        subgenres: [],
        fusionGenres: []
      });
    }
  }

  const tree = {
    name: 'Music Genres',
    description: 'Все жанры и стили по данным Discogs',
    playlistUrl: `https://open.spotify.com/playlist/${SPOTIFY_TEMPLATE_ID}`,
    subgenres: genres.results.map(g => ({
      name: g.name,
      description: g.id ? `Discogs genre #${g.id}` : '',
      playlistUrl: `https://open.spotify.com/playlist/${SPOTIFY_TEMPLATE_ID}`,
      subgenres: subgenresMap[g.name] || [],
      fusionGenres: []
    })),
    fusionGenres: []
  };

  fs.writeFileSync('genres.json', JSON.stringify(tree, null, 2), 'utf-8');
  console.log(`✅ Сгенерирован genres.json с ${tree.subgenres.length} жанрами и их поджанрами.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
