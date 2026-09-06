# Anteprima degli stili, senza pubblicare il sito

Tre attrezzi per guardare le varianti senza metterle online.

## Una pagina sola, autosufficiente

```
npm run build
node tools/anteprima/build-preview.mjs /percorso/anteprima.html
```

Prende l'export statico da `out/`, mette il CSS in linea e la foto in data
URI, butta via il JavaScript di Next e al suo posto mette
`preview-runtime.js`: rifà in JS semplice le rivelazioni allo scorrimento,
il menu degli stili e il bottom sheet. Il risultato è un unico file HTML che
si apre ovunque — anche come artifact privato — e contiene tutte e due le
pagine, con una barra in basso per passare dall'una all'altra.

Nota: il file non ha `<head>`, quindi da solo su disco gli manca il
`<meta name="viewport">` e il browser lo impagina come desktop. Chi lo apre
come artifact non se ne accorge (l'involucro lo aggiunge); per controllarlo
in locale basta anteporre la riga del meta a mano.

## Screenshot fedeli

```
node tools/anteprima/shot.mjs <url> <file.png> [larghezza] [altezza] [#ancora] [stile]
```

Serve Chromium (già presente in `/opt/pw-browsers`) e `playwright-core`.
Emula il dispositivo davvero — `chrome --headless --window-size` ritaglia
soltanto la finestra e mostra il layout desktop tagliato — scorre
all'ancora e aspetta che le animazioni d'ingresso finiscano. L'ultimo
parametro forza lo stile via `localStorage`.
