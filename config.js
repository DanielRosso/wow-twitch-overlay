// Einstellungen für alle Overlays.
// Nach einer Änderung in Streamlabs bei jeder Quelle "Cache der aktuellen Seite aktualisieren" klicken.
const CONFIG = {
  channel: 'blubbmon', // dein Twitch-Kanal, ohne #

  // Chat (index.html)
  size: 22,    // Schriftgrösse in Pixel
  bg: 1,       // Deckkraft des schwarzen Hintergrunds: 0 = durchsichtig, 1 = voll schwarz
  fade: 120,   // Sekunden, bis eine Zeile ausblendet (0 = nie)
  lines: 50,   // so viele Zeilen werden höchstens behalten
  time: true,  // Uhrzeit vor jeder Zeile anzeigen

  // Erfolge (erfolg.html und Chat)
  bits: 1000,  // ab so vielen Bits in einer Nachricht gibt es den Erfolg "Goldesel"

  // Gruppenfenster (gruppe.html)
  dead: 10,    // Minuten ohne Nachricht, bis jemand "Tot" ist
  raid: 20,    // höchstens so viele Rahmen. Ab 6 Personen Schlachtzugsansicht, 5 = immer nur Gruppe

  // Ladebildschirm (laden.html)
  title: 'Stream startet gleich',
  countdown: 5, // Minuten bis zum Start, zählt ab dem Einblenden der Szene
  tips: [
    'Schreib im Chat, dann landest du im Gruppenfenster.',
    'Wer zum ersten Mal im Chat schreibt, bekommt einen Erfolg.',
    'Mods schreiben im Gildenchat, VIPs im Gruppenchat.',
    'Wer lange nichts schreibt, stirbt im Gruppenfenster. Eine Nachricht belebt wieder.',
    'Bits erscheinen im Chat als Gold.',
  ],

  // AFK-Bildschirm (afk.html)
  afk: 'Bin gleich zurück',
};
