# MyFirstPwa partendo da articolo Google:
## Your First Progressive Web App Codelab

These are the resource files needed for the
[Your First Progressive Web App][codelab] codelab.

In this codelab, you'll  build a weather web app using Progressive Web App
techniques. Your app will:

* Use responsive design, so it works on desktop or mobile.
* Be fast & reliable, using a service worker to precache the app resources
  (HTML, CSS, JavaScript, images) needed to run, and cache the weather data
  at runtime to improve performance.
* Be installable, using a web app manifest and the `beforeinstallprompt` event
  to notify the user it's installable.

## Mie prove
* Ho creato il progetto seguendo le istruzioni del codelab.
* Ho creato un progetto nella console di Firebase di Google.
* Ho creato un hosting in cui ho fatto deploy del progetto da linea di comando.
* ho installato l'app sul cellulare puntando il browser sull'indirizzo web del hosting. L'app si è installata tra le applicazioni normali ed ha creato un'icona sul desktop.
* Modificato il progetto ed eseguito il deploy
* L'app si è aggiornata sul cellulare senza notifica
## Dati Meteo
* Aggiunto in lista anche la posizione di Felino. La richiesta in pagina web è la seguente (con temperature in °C):
https://darksky.net/forecast/44.69,10.24/ca12/en
* La chiamata per i dati in formato JSON è: https://api.darksky.net/forecast/622f1b931d60c59311cb7d3f166ad4b8/37.8267,-122.4233 dove il valore numerico è la mia chiave personale.
* Sembra non essere possibile introdurre 'ca12/en' nell'URL delle API per avere le temperature in °C - **Usare '?lang=it&units=ca' per lingua italiana e unità SI**


La app sembra non richiedere i dati al server DarkSky in quanto non definisce una URL assoluta, ma relativa al sito corrente (???).

La richiesta dei dati viene eseguita da server.js !?!? Forse per evitare il problema del CORS ?? Ma poi l'app sul mobile come fa ????

Il server.js dovrebbe recuperare la chiave per DarkSky dal file .env ma non la riceve ..
Sembra essere necessario installare il plugin dotnet di node con:
```
npm install dotenv
```

### Come cambiare versione dell'app ?? TBD

### Notifica per aggiornamento app
Link: https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717

Link : https://deanhume.com/displaying-a-new-version-available-progressive-web-app/

Link: https://colmenerodigital.com/blog/implementing-pwa-update-notification/


## Come debuggare app ?
Lo strumento principale per fare debug della app è Chrome DevTool che interagisce con Chrome.

Un altro tool per la verifica della 'bontà' dell'applicazione è LightHouse, sempre da usare all'interno di Chrome. Dà utilissime informazioni sulla compatibilità e completezza della PWA.

Anche Firefox ha il supporto per i ServiceWorkers (49+) ma normalmente è disattivato. Deve essere abilitato nella pagina **about:config** alla voce **dom.serviceWorkers.enable**.

#### Mia soluzione
Come prima soluzione ilorogetto è corredato da un semplice server sviluppato in Javascript per nodeJS.
Per installare tutti i moduli necessari al funzionamento è necessario lanciare il comando:
```
npm install
```
Queso comando ha creato la cartella node_modules (non è sotto il controllo di GIT) e scaricato i moduli necessari. 
Per lanciare il server (in ascolto sulla porta **8000**) battere:
```
node server.js
```


## What you'll learn

* How to create and add a web app manifest
* How to provide a simple offline experience
* How to provide a full offline experience
* How to make your app installable

## Getting started

To get started, check out the [codelab instruction][codelab]


## Feedback

This is a work in progress, if you find a mistake, please [file an issue][git-issue].


## License

Copyright 2019 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor
license agreements. See the NOTICE file distributed with this work for
additional information regarding copyright ownership. The ASF licenses this
file to you under the Apache License, Version 2.0 (the “License”); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.


[codelab]: https://codelabs.developers.google.com/codelabs/your-first-pwapp/
[git-issue]: https://github.com/googlecodelabs/your-first-pwapp/issues
