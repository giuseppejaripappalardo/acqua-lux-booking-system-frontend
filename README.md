<div align="center">

# AcquaLux Frontend

Interfaccia utente del sistema di prenotazione imbarcazioni di lusso AcquaLux, sviluppata come project work universitario.

</div>

<details>
<summary><strong>📚 Contesto Accademico</strong></summary>

|                                      |                                                                                                             |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **Università**                       | Università Telematica Pegaso                                                                                |
| **Corso di Studio**                  | Informatica per le Aziende Digitali (L-31)                                                                  |
| **Settori Scientifico-Disciplinari** | • Informatica (INF/01)<br>• Ingegneria Economico-Gestionale (ING-IND/35)                                    |
| **Tema**                             | 1 - La digitalizzazione dell'impresa                                                                        |
| **Traccia**                          | 1.4 - Sviluppo di una pagina web per un servizio di prenotazione online di un'impresa del settore terziario |
| **CFU**                              | 3                                                                                                           |

</details>

## 📝 Descrizione del Progetto

AcquaLux è un'applicazione web che consente di effettuare prenotazioni per il noleggio di imbarcazioni di lusso, per soddisfare le esigenze delle imprese del settore terziario. Questo repository contiene il **frontend** della web application realizzata con React.

L'applicazione consente agli utenti che hanno effettuato l'accesso di consultare il catalogo ed effettuare, modificare e cancellare le proprie prenotazione. L'interfaccia è stata pensata per essere semplice e intuitiva con un occhio di riguardo alla responsiveness della UI.
## 🛠️ Tecnologie Principali

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

</div>

## ⚙️ Funzionalità Implementate

<div align="center">

| Funzionalità        | Descrizione                                                                            |
|---------------------|----------------------------------------------------------------------------------------|
| 🔐 **Login**    | Gestione dell'autenticazione JWT                                                       |
| 🔍 **Ricerca**       | Ricerca imbarcazioni disponibili al noleggio per data e numero di posti                |
| ✅ **Prenotazione**   | Creazione, modifica e cancellazione delle prenotazioni                                 |
| 📱 **Responsive UI**  | Interfaccia responsive e ottimizzata per diversi dispositivi (Desktop, Tablet, Mobile) |

</div>

## 🧪 Modalità di Sviluppo

## Avvio del progetto in modalità sviluppo

Per avviare il progetto in **modalità sviluppo**, è fondamentale configurare correttamente le variabili d'ambiente e il proxy verso il backend.

### Proxy Vite e gestione CORS

In ambiente di sviluppo, le chiamate verso il backend vengono gestite tramite **proxy**, configurato in `vite.config.ts`, per evitare problemi di **CORS**, specialmente quando il frontend comunica con un backend in **staging** o produzione.
Nel mio caso specifico, ho gestito il tutto tramite il proxy vite, lavorando in locale sul frontend, avendo l'esigenza di poter puntare su giuseppejaripappalardo.dev.

In questo caso, l'url di base usato dal client HTTP viene impostata a una **stringa vuota (`""`)**, per far si che l'url sia relativo e punti in locahost/127.0.0.1, così che Vite possa intercettare correttamente le richieste ed effettuare il proxy verso l'host backend configurato.

> ℹ️ Il valore definito in `VITE_API_BASE_URL` viene utilizzato **solo** quando il progetto non è in esecuzione in modalità sviluppo.

### File `.env` richiesto

Occorre creare un file `.env` nella root del progetto frontend con le seguenti variabili, per l'ambiente locale:

```env
VITE_API_BASE_URL=http://127.0.0.1
VITE_DEV_ENV=DEV
```

A questo punto è possibile eseguire i comandi
``` bash
npm install
```

Ed infine 

``` bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo `http://localhost:5173`.

## Collegamento con il Backend
È fondamentale che il backend sia stato avviato e che risulti chiaramente accessibile all’indirizzo previsto (Se avviato in locale) (`http://127.0.0.1:8000/api/v1`).

## 👨‍💻 Sviluppato da

**Giuseppe Jari Pappalardo**  
Matricola: 0312300959  
Università Telematica Pegaso  
Corso di Laurea in Informatica per le Aziende Digitali

## 📄 Licenza

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
Questo progetto è distribuito con licenza MIT. Vedere il file `LICENSE` per maggiori dettagli.