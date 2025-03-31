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
    }).setZone(timezone).toFormat("dd/MM/yyyy HH:mm");
}

export const parseUtcToLocal = (date: string | null) => {
    if (!date) {
        return "";
    }
    const localDateTime = DateTime.fromISO(date, {
        zone: "utc"
    }).setZone(timezone);

    if (!localDateTime.isValid) {
        return "";
    }

    return localDateTime.toFormat("yyyy-MM-dd'T'HH:mm");
}



export const stateStdDatetimeFormat = "yyyy-MM-dd'T'HH:mm";
export const timezone = "Europe/Rome"