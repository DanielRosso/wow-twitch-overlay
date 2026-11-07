# WoW-Overlays für Twitch

Overlays im Stil von World of Warcraft für Streamlabs oder OBS. Sie zeigen deinen Twitch-Chat so, wie er in WoW aussehen würde, und bringen Erfolge, ein Gruppenfenster und passende Pausenbildschirme mit.

| Datei | Was sie zeigt | Startgrösse |
|---|---|---|
| `index.html` | Chatfenster mit Tabs, Klassenfarben, Emotes und Zeitstempel | 500 × 290 |
| `erfolg.html` | Popup „Erfolg errungen“ bei erster Nachricht, Sub, Abo-Geschenk, Raid, Bits und Vielschreibern | 480 × 130 |
| `gruppe.html` | Gruppenfenster mit dir und den zuletzt aktiven Chattern, ab 6 Personen als Schlachtzug | 440 × 260 |
| `raidwarnung.html` | Schlachtzugswarnung: grosser roter Text bei einem Raid oder auf Befehl | 1600 × 220 |
| `laden.html` | Ladebildschirm für den Streamstart mit Countdown und Tipps | 1920 × 1080 |
| `afk.html` | AFK-Bildschirm für Pausen | 1920 × 1080 |

Du brauchst kein Twitch-Login, kein Token und keinen Server. Die Overlays lesen den öffentlichen Chat mit, so wie ein ausgeloggter Zuschauer auf twitch.tv. Sie können nichts in den Chat schreiben.

## Einrichten

1. Den Ordner herunterladen: auf GitHub **Code** → **Download ZIP**, entpacken und an einen festen Platz legen, z. B. `C:\Overlays\wow`. Alle Dateien müssen im selben Ordner bleiben.
2. `config.js` mit einem Texteditor öffnen und bei `channel` deinen Twitch-Kanal eintragen, ohne `#`:
   ```js
   channel: 'deinkanal',
   ```
3. In Streamlabs für jedes Overlay, das du willst, eine **Browserquelle** anlegen:
   - Haken bei **Lokale Datei** setzen und die HTML-Datei aus dem Ordner wählen.
   - Breite und Höhe aus der Tabelle oben eintragen.
   - Die Quelle in der Liste **über** die Spielaufnahme schieben und im Vorschaufenster platzieren.

Nach jeder Änderung an `config.js` klickst du in den Eigenschaften jeder Quelle auf **Cache der aktuellen Seite aktualisieren**.

## Einstellungen in `config.js`

| Einstellung | Standard | Wirkung |
|---|---|---|
| `channel` | `'blubbmon'` | Twitch-Kanal, den alle Overlays mitlesen |
| `size` | `22` | Schriftgrösse im Chat in Pixel |
| `bg` | `1` | Deckkraft des schwarzen Chat-Hintergrunds, von `0` (durchsichtig) bis `1` (voll schwarz) |
| `fade` | `120` | Sekunden, bis eine Chatzeile ausblendet. `0` heisst nie. |
| `lines` | `50` | So viele Chatzeilen bleiben höchstens gespeichert |
| `time` | `true` | Uhrzeit vor jeder Chatzeile. `false` blendet sie aus. |
| `bits` | `1000` | Ab so vielen Bits in einer Nachricht gibt es den Erfolg „Goldesel“ |
| `dead` | `10` | Minuten ohne Nachricht, bis jemand im Gruppenfenster „Tot“ ist |
| `raid` | `20` | So viele Rahmen zeigt das Gruppenfenster höchstens. `5` heisst immer nur Gruppe. |
| `title` | `'Stream startet gleich'` | Überschrift des Ladebildschirms |
| `countdown` | `5` | Minuten bis zum Start auf dem Ladebildschirm |
| `tips` | 5 Tipps | Tipps, die der Ladebildschirm alle 10 Sekunden wechselt |
| `afk` | `'Bin gleich zurück'` | Text auf dem AFK-Bildschirm |

## Chat

Jede Twitch-Rolle bekommt einen WoW-Chatkanal:

| Twitch | Darstellung im Chat |
|---|---|
| Zuschauer | weiss: `[Name] sagt: …` |
| Mod | grün: `[Gilde] [Name]: …` |
| VIP | blau: `[Gruppe] [Name]: …` |
| Streamer | orange: `[Schlachtzugsleiter] [Name]: …` |
| Nachricht mit `@deinkanal` | rosa: `[Name] flüstert: …` |
| `/me`-Nachricht | orange wie ein WoW-Emote |
| Sub, Raid und Ähnliches | gelb wie eine Systemmeldung |

Jeder Name bekommt eine feste WoW-Klassenfarbe. Abonnenten tragen ein `<Abo>` vor dem Namen. Löscht ein Mod eine Nachricht oder bannt jemanden, verschwindet die Zeile auch im Overlay.

Bits erscheinen als Gold: `[Name] hat 100 Gold gespendet.` Die Cheer-Wörter wie `Cheer100` werden aus der Nachricht entfernt, der restliche Text bleibt stehen.

Neben Twitch-Emotes zeigt der Chat auch die Emotes von 7TV, BetterTTV und FrankerFaceZ, globale und die deines Kanals. Das Overlay lädt die Listen beim Start einmal. Neue Emotes erscheinen nach **Cache der aktuellen Seite aktualisieren**.

Verschenkt jemand mehrere Subs auf einmal, zeigt der Chat nur die Sammelmeldung und nicht jedes einzelne Geschenk.

## Erfolge

| Erfolg | Auslöser | Punkte |
|---|---|---|
| Erste Worte | allererste Nachricht einer Person in deinem Kanal | 10 |
| Treuer Abonnent | Sub oder Resub | 10 |
| Spendierfreudig | Abo-Geschenk, auch mehrere auf einmal (ein Erfolg pro Geschenk-Aktion) | 10 |
| Gruppe gesucht | Raid auf deinen Kanal | 25 |
| Goldesel | mindestens 1000 Bits in einer Nachricht (`bits` in `config.js`) | 25 |
| Gesprächig | 100. Nachricht einer Person | 10 |
| Stammgast | 1000. Nachricht einer Person | 25 |

Jeder Erfolg erscheint als Popup in `erfolg.html` und zusätzlich als gelbe Zeile im Chat, z. B. `[Name] hat den Erfolg [Erste Worte] errungen!`. Kommen mehrere gleichzeitig, zeigt das Popup sie nacheinander. Die Regeln stehen in `twitch.js` in der Funktion `achievementOf`.

Für „Gesprächig“ und „Stammgast“ zählen die Overlays die Nachrichten jeder Person im Browser-Speicher von Streamlabs. Gezählt wird ab dem ersten Einsatz, ältere Nachrichten kennt das Overlay nicht. Wird der Speicher von Streamlabs gelöscht, beginnt die Zählung von vorn. Bots wie Nightbot zählen nicht.

## Gruppenfenster

Oben stehst du mit Krone. Darunter kommen die zuletzt aktiven Chatter: Mods als Tank, VIPs als Heiler, alle anderen als Schadensverursacher. Bots wie Nightbot oder StreamElements kommen nicht hinein.

- Der Lebensbalken sinkt, je länger jemand nichts schreibt. Nach `dead` Minuten steht dort „Tot“, nach doppelt so langer Zeit verlässt die Person die Gruppe.
- Schreibt jemand wieder, steigt eine grüne Heilzahl wie `+40%` auf. War die Person tot, steht dort gelb „Wiederbelebt“.
- Kleine Buff-Symbole unten rechts zeigen Abo (Stern), Erstschreiber (Sprechblase) und Bits (Münze).
- Bis 5 Personen sieht es aus wie ein WoW-Gruppenfenster. Ab 6 Personen schaltet es auf kleine Schlachtzugsrahmen in Spalten zu je 5 um, höchstens `raid` Rahmen.

## Schlachtzugswarnung

Bei einem Raid erscheint gross und rot `Name stürmt mit 42 Mitstreitern herein!`. Du und deine Mods könnt die Warnung auch selbst auslösen, indem ihr `!rw` und einen Text in den Chat schreibt, z. B. `!rw Boss pullt gleich!`. Die Warnung bleibt 10 Sekunden stehen.

## Ladebildschirm und AFK

`laden.html` ist für eine eigene Startszene gedacht. Der Ladebalken füllt sich über `countdown` Minuten, darüber wechseln die Tipps aus `config.js`. Damit der Countdown bei jedem Einblenden neu beginnt, schaltest du in der Quelle **Browser aktualisieren, wenn Szene aktiv wird** ein.

`afk.html` dunkelt das Bild ab, das Spiel bleibt dahinter sichtbar. Lege die Quelle über die Spielaufnahme und blende sie bei Pausen ein. Damit die Zeit „Abwesend seit“ jedes Mal bei null beginnt, schaltest du **Quelle herunterfahren, wenn nicht sichtbar** ein.

## Testen ohne Chat

Zu den Live-Overlays gibt es Testversionen mit Beispielnachrichten: `index-test.html`, `erfolg-test.html`, `gruppe-test.html` und `raidwarnung-test.html`. Wähle sie in der Browserquelle als **Lokale Datei** aus, um die Quelle zu platzieren. Danach stellst du wieder auf die normale Datei um.

- Im Test-Chat kommt alle 1,5 Sekunden eine Nachricht, nach 3 Sekunden ein Erfolg und nach 6 Sekunden eine Gold-Spende.
- Das Test-Popup zeigt alle 7 Sekunden einen der sieben Erfolge.
- Im Test-Gruppenfenster ist man schon nach 1 Minute „Tot“. Mit der Zeit kommen mehr als 5 Personen dazu, dann siehst du auch die Schlachtzugsansicht.
- Die Test-Schlachtzugswarnung zeigt alle 6 Sekunden eine Beispielwarnung.

Einzelne Einstellungen kannst du auch nur für eine Quelle überschreiben. Dafür den Haken bei **Lokale Datei** entfernen und als URL den Dateipfad mit Zusätzen eintragen, z. B. `file:///C:/Overlays/wow/index.html?size=18&bg=0.8`. Leerzeichen im Pfad schreibst du als `%20`. Möglich sind `channel`, `size`, `bg`, `fade`, `lines`, `time=0`, im Gruppenfenster `dead` und `raid` und im Ladebildschirm `countdown`.

## Dateien

- `config.js`: deine Einstellungen
- `twitch.js`: Verbindung zum Twitch-Chat und Regeln für Erfolge, wird von allen Overlays geladen
- `emotes.js`: lädt die Emotes von 7TV, BetterTTV und FrankerFaceZ für den Chat
- `index.html`, `erfolg.html`, `gruppe.html`, `raidwarnung.html`, `laden.html`, `afk.html`: die Overlays
- `*-test.html`: Testversionen mit Beispielnachrichten

Schriften und Symbole sind nachgebaut. Grafiken von Blizzard sind nicht enthalten. Die Chatschrift ist Arial Narrow. Fehlt sie auf dem PC, lädt das Overlay Roboto Condensed von Google Fonts.
