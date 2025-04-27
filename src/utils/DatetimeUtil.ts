import {DateTime} from "luxon";

export const beautifyDatetime = (date: string | null) => {
    if (!date) {
        return "Error"
    }
    return DateTime.fromFormat(date, stateStdDatetimeFormat).toFormat("dd/MM/yyyy HH:mm");
}

export const beautifyFromIso = (date: string | null) => {
    if (!date) {
        return "Error"
    }
    return DateTime.fromISO(date, {
        zone: "utc"
    }).setZone(tzEuropeRome).toFormat("dd/MM/yyyy HH:mm");
}

export const parseLocalToUtc = (date: string | null) => {

    /**
     * Se la stringa è null o vuota, lancio eccezione
     */
    if(!date || date.trim() === "") {
        throw new Error("Date non può essere null o vuota. E' opportuno fornire un datetime in formato valido (datetime-local)")
    }

    /**
     * Effettuo il parsing della stringa data/ora usando il formato yyyy-MM-dd'T'HH:mm e il fuso orario Europe/Rome,
     * cosi da ottenere un oggeto DateTime che corrisponde all'orario locale inserito in input dall'utente.
     * Successivamente converto in UTC.
     */
    const localDateTime = DateTime.fromFormat(date, stateStdDatetimeFormat, {
        zone: tzEuropeRome
    }).setZone("utc");

    /**
     * A questo punto dobbiamo verificare se il risultato dell'operazione ha prodotto un valore datetime considerato valid.
     */
    if (!localDateTime.isValid) {
        throw new Error("Il datetime ricevuto in input non ha prodotto un risultato valido. E' opportuno fornire un datetime in formato valido (datetime-local)")
    }

    /**
     * A questo punto possiamo restituire il datetime in formato ISO UTC.
      */
    return localDateTime.toISO()
}

export const parseUtcToLocal = (date: string | null) => {
    if (!date) {
        return "";
    }
    const localDateTime = DateTime.fromISO(date, {
        zone: "utc"
    }).setZone(tzEuropeRome);

    if (!localDateTime.isValid) {
        return "";
    }

    return localDateTime.toFormat("yyyy-MM-dd'T'HH:mm");
}



export const stateStdDatetimeFormat = "yyyy-MM-dd'T'HH:mm";
export const tzEuropeRome = "Europe/Rome"