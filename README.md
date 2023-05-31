# MyFirstPwa partendo da articolo Google:
## Your First Progressive Web App Codelab

# INTRO
L'app è diventata un visualizzatore di meteo
con dati provenienti da OpenWeather


In this codelab, you'll  build a weather web app using Progressive Web App
techniques. Your app will:

* Use responsive design, so it works on desktop or mobile.
* Be fast & reliable, using a service worker to precache the app resources
  (HTML, CSS, JavaScript, images) needed to run, and cache the weather data
  at runtime to improve performance.
* Be installable, using a web app manifest and the `beforeinstallprompt` event
  to notify the user it's installable.
  Su Android appare sia l'icona nella pagina che un'icona nel browser.

## Mie modifiche
* Ho creato il progetto seguendo le istruzioni del codelab.
* Ho creato un progetto nella console di Firebase di Google.
* Ho creato un hosting in cui ho fatto deploy del progetto da linea di comando.
* ho installato l'app sul cellulare puntando il browser sull'indirizzo web del hosting. L'app si è installata tra le applicazioni normali ed ha creato un'icona sul desktop.
* Modificato il progetto ed eseguito il deploy
* L'app si è aggiornata sul cellulare senza notifica
* Testare se l'app funziona anche su un server HTTPS diverso da quello di Google - soprattutto per l'aggiornamento della app
* Perchè non funziona se lanciato sul server di Google ? Perchè richiede la fetch in locale https://myfirstpwa-37305.web.app/forecast/40.7720232,-73.9732319 e non al server remoto (su PC lo esegue nodejs!!). 
In ogni caso viene generato un errore 404 che non viene gestito correttamente ..

Lancio del server locale con ```node server.js``` - il server si pone in attesa sulla porta 8000.

### La connessione va fatta con http://localhost:8000/index.html - Nota: NON https o con 127.0.0.1 !!

## Live server
La prova di test con server locale è stata fatta anche con l'estensione *Live Server* di *Visual Studio Code* che monta un server sulla porta 4500. 
Per spostare la root del webserver sulla cartella *public*, ed eventualmente cambiare il numero di porta, è stato necessario inserire un file di configurazione in *.vscode/settings.json*
Premere la scritta 'Live server' nell'angolo in basso a dx di VSCode per lanciare anche Chrome.


## Esportazione per Firebase

Registrato il progetto in https://myfirstpwa-37305.web.app/
Da questo indirizzo è possibile installare l'app sul telefonino.

Comando per il deploy:

```
firebase deploy
```


# Dati Meteo DarkSky
* Aggiunto in lista anche la posizione di Felino. La richiesta in pagina web è la seguente (con temperature in °C):
https://darksky.net/forecast/44.69,10.24/ca12/en
* La chiamata per i dati in formato JSON è: https://api.darksky.net/forecast/622f1b931d60c59311cb7d3f166ad4b8/37.8267,-122.4233 dove il valore numerico è la mia chiave personale.
* Sembra non essere possibile introdurre 'ca12/en' nell'URL delle API per avere le temperature in °C - **Usare '?lang=it&units=ca' per lingua italiana e unità SI**


La app sembra non richiedere i dati al server DarkSky in quanto non definisce una URL assoluta, ma relativa al sito corrente (???).

## Darksky
Dark Sky’s features have been integrated into Apple Weather. 

**Support for the Dark Sky API ended on March 31, 2023**

## Problema chiave DarkSky
Il server.js dovrebbe recuperare la chiave per DarkSky dal file .env ma non la riceve ..
Sembra essere necessario installare il plugin dotnet di node con:
```
npm install dotenv
```
**DarkSky - removed**



# Problema CORS
La richiesta dei dati viene eseguita da server.js !! Forse per evitare il problema del CORS ?? Ma poi l'app sul mobile come fa ??
Risposta dell'autore ad una mia richiesta su GitHub:
```
Unfortunately - due to the CORS requirements of the Dark Sky API, you need to use the node server to proxy the data.
```

Il problema CORS è un problema insito nel sistema di protezione di un browser che non consente di regola di fare richieste cross-dominio (diverso protocollo, indirizzo o porta): vedere https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
```
A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, and port) than its own origin.
...
For security reasons, browsers restrict cross-origin HTTP requests initiated from within scripts. For example, XMLHttpRequest and the Fetch API follow the same-origin policy. This means that a web application using those APIs can only request HTTP resources from the same origin the application was loaded from, unless the response from the other origin includes the right CORS headers.

```


Fonte: https://www.joshmorony.com/dealing-with-cors-cross-origin-resource-sharing-in-ionic-applications/
```
The Solution for CORS Issues

The best way to deal with CORS is to abide by the rules of the browser and implement CORS correctly. That means enabling CORS on the server you are making a request to.
...
Exactly how you enable CORS depends on your server. In general, you need to add a header to the server response that looks like this:

Access-Control-Allow-Origin: *

I will list these workarounds in my order of preference from best to worst.

1. Proxy requests through an additional server
2. Proxy requests through native code
3. Downgrade to UIWebView (not recommended)

```

# OpenWeatherMap

Soluzione:

Cambio server e provo a richiedere dati a https://openweathermap.org/API.

Mi sono registrato e ho ottenuto la chiave:
APPID = 'b82ec2f9c61a9f11fbe81ec3d5100227'

Sito https://openweathermap.org/

## Autenticazione
http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY} 

## Modalità: Current weather data
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon} 

## Modalità: Forecast
https://api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml

## Modalità: Forecast daily per max 16 gg
https://api.openweathermap.org/data/2.5/forecast/daily?q=London,us&mode=xml

## Icone
Link icone normali: https://openweathermap.org/img/wn/13d.png

Link icone doppie: https://openweathermap.org/img/wn/13d@2x.png

Ci sono anche quelle notturne sostituendo la lettera 'd' con la lettera 'n'.




# Geolocalizzazione
Aggiunta la possibilità di inserire un luogo attraverso il nome del luogo stesso, oltre che via coordinate o lista.

## Siti
https://locationiq.com/ - RESTful API - Free API - Max 10.000 richiesta al giorno - Permette anche il reverse-geo

Registrato il 31.12.2019 su iegghilba@gmail.com
API key: a9e750a5eb2f83

https://opencagedata.com - RESTful API - Free API Key - Max 2500 richieste al giorno

https://www.gps-coordinates.net/api/Felino - Nessuna registrazione - Problema CORS

# Domande

## Come cambiare versione dell'app ?? 
TBD


## Come debuggare app ?
Lo strumento principale per fare debug della app è Chrome DevTool che interagisce con Chrome.

Un altro tool per la verifica della 'bontà' dell'applicazione è LightHouse, sempre da usare all'interno di Chrome. Dà utilissime informazioni sulla compatibilità e completezza della PWA.

Anche Firefox ha il supporto per i ServiceWorkers (49+) ma normalmente è disattivato. Deve essere abilitato nella pagina **about:config** alla voce **dom.serviceWorkers.enable**.

#### Mia soluzione
Come prima soluzione il progetto è corredato da un semplice server sviluppato in Javascript per nodeJS.
Per installare tutti i moduli necessari al funzionamento è necessario lanciare il comando:
```
npm install
```
Queso comando ha creato la cartella node_modules (non è sotto il controllo di GIT) e scaricato i moduli necessari. 
Per lanciare il server (in ascolto sulla porta **8000**) battere:
```
node server.js
```



