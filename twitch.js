// Twitch-Chat anonym mitlesen (kein Login). handler(msg, ws) bekommt { tags, cmd, text }.
function parseIrc(raw) {
  const tags = {};
  if (raw[0] === '@') {
    const s = raw.indexOf(' ');
    for (const kv of raw.slice(1, s).split(';')) {
      const j = kv.indexOf('=');
      tags[kv.slice(0, j)] = kv.slice(j + 1).replace(/\\s/g, ' ').replace(/\\:/g, ';').replace(/\\\\/g, '\\');
    }
    raw = raw.slice(s + 1);
  }
  if (raw[0] === ':') raw = raw.slice(raw.indexOf(' ') + 1);
  const t = raw.indexOf(' :');
  const parts = (t >= 0 ? raw.slice(0, t) : raw).split(' ');
  return { tags, cmd: parts[0], text: t >= 0 ? raw.slice(t + 2) : '' };
}

function connectTwitch(channel, handler) {
  const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
  ws.onopen = () => {
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
    ws.send('PASS SCHMOOPIIE');
    ws.send('NICK justinfan' + Math.floor(Math.random() * 1e5));
    ws.send('JOIN #' + channel);
  };
  ws.onmessage = e => e.data.split('\r\n').forEach(l => {
    if (!l) return;
    const m = parseIrc(l);
    if (m.cmd === 'PING') ws.send('PONG :tmi.twitch.tv');
    else handler(m, ws);
  });
  ws.onclose = () => setTimeout(() => connectTwitch(channel, handler), 3000);
}

// Einstellungen aus config.js, einzelne Werte lassen sich per URL überschreiben
const params = new URLSearchParams(location.search);
const CHANNEL = (params.get('channel') || CONFIG.channel).replace('#', '').trim().toLowerCase();
const DEMO = params.has('demo');

const BOTS = /^(nightbot|streamelements|streamlabs|moobot|fossabot|wizebot|soundalerts)$/i;
const roleOf = t => {
  const b = t.badges || '';
  return /broadcaster/.test(b) ? 'broadcaster' : t.mod === '1' ? 'moderator' : /vip\//.test(b) ? 'vip' : 'viewer';
};

// Nachrichten pro Person zählen (für Stammzuschauer-Erfolge). Bleibt im Browser-Speicher von Streamlabs.
// Jede Seite zählt für sich, damit Chat und Popup nicht doppelt zählen.
function countMessage(uid) {
  if (DEMO || !uid) return 0;
  try {
    const key = `count:${location.pathname.split('/').pop()}:${uid}`;
    const n = (+localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, n);
    return n;
  } catch { return 0; }
}

// Welche Twitch-Ereignisse einen Erfolg auslösen. Gibt { name, title, points, icon } oder null zurück.
function achievementOf(m) {
  const t = m.tags, name = t['display-name'] || t.login;
  if (m.cmd === 'PRIVMSG') {
    if (BOTS.test(name || '')) return null;
    const n = countMessage(t['user-id']);
    if (+t.bits >= (CONFIG.bits ?? 1000)) return { name, title: 'Goldesel', points: 25, icon: 'coin' };
    if (t['first-msg'] === '1') return { name, title: 'Erste Worte', points: 10, icon: 'chat' };
    if (n === 100) return { name, title: 'Gesprächig', points: 10, icon: 'chat' };
    if (n === 1000) return { name, title: 'Stammgast', points: 25, icon: 'crown' };
  } else if (m.cmd === 'USERNOTICE') {
    const id = t['msg-id'];
    if (id === 'sub' || id === 'resub') return { name, title: 'Treuer Abonnent', points: 10, icon: 'star' };
    if (id === 'raid') return { name: t['msg-param-displayName'] || name, title: 'Gruppe gesucht', points: 25, icon: 'sword' };
    // Bei mehreren verschenkten Subs schickt Twitch eine Sammelmeldung und danach eine pro Geschenk.
    // Nur die Sammelmeldung oder ein einzelnes Geschenk zählt.
    if (id === 'submysterygift' || (id === 'subgift' && !t['msg-param-community-gift-id']))
      return { name, title: 'Spendierfreudig', points: 10, icon: 'gift' };
  }
  return null;
}

// Namen bekommen eine feste WoW-Klassenfarbe
const CLASS = ['#C41E3A','#A330C9','#FF7C0A','#33937F','#AAD372','#3FC7EB','#00FF98',
               '#F48CBA','#FFFFFF','#FFF468','#0070DD','#8788EE','#C69B6D'];
const classColor = n => { let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) | 0; return CLASS[Math.abs(h) % CLASS.length]; };
