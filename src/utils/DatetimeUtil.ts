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
    return DateTime.fromISO(date).toFormat("dd/MM/yyyy HH:mm");
}

export const stateStdDatetimeFormat = "yyyy-MM-dd'T'HH:mm";
export const timezone = "Europe/Rome"