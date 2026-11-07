// Emotes von 7TV, BTTV und FFZ laden (öffentliche Listen, kein Login). Wort -> Bild-URL.
const EXTRA_EMOTES = new Map();

async function loadExtraEmotes(roomId) {
  const get = url => fetch(url).then(r => (r.ok ? r.json() : null)).catch(() => null);
  const add = (name, url) => name && url && EXTRA_EMOTES.set(name, url.startsWith('//') ? 'https:' + url : url);
  const [ffzG, bttvG, stvG, ffzC, bttvC, stvC] = await Promise.all([
    get('https://api.frankerfacez.com/v1/set/global'),
    get('https://api.betterttv.net/3/cached/emotes/global'),
    get('https://7tv.io/v3/emote-sets/global'),
    get(`https://api.frankerfacez.com/v1/room/id/${roomId}`),
    get(`https://api.betterttv.net/3/cached/users/twitch/${roomId}`),
    get(`https://7tv.io/v3/users/twitch/${roomId}`),
  ]);
  const ffz = sets => sets.forEach(s => s?.emoticons?.forEach(e => add(e.name, e.urls['2'] || e.urls['1'])));
  const bttv = list => list?.forEach(e => add(e.code, `https://cdn.betterttv.net/emote/${e.id}/2x`));
  const stv = list => list?.forEach(e => add(e.name, `https://cdn.7tv.app/emote/${e.id}/2x.webp`));

  // Reihenfolge: global vor Kanal, damit Kanal-Emotes gleichnamige globale überschreiben
  if (ffzG) ffz((ffzG.default_sets || []).map(id => ffzG.sets[id]));
  bttv(bttvG);
  stv(stvG?.emotes);
  if (ffzC) ffz(Object.values(ffzC.sets || {}));
  bttv(bttvC && [...(bttvC.channelEmotes || []), ...(bttvC.sharedEmotes || [])]);
  stv(stvC?.emote_set?.emotes);
}
