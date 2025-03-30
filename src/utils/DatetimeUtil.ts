import {DateTime} from "luxon";

export const beautifyDatetime = (date: string | null) => {
    if (!date) {
        return "Error"
    }
    return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm").toFormat("dd/MM/yyyy HH:mm");
}

export const stateStdDatetimeFormat = "yyyy-MM-dd'T'HH:mm";
export const timezone = "Europe/Rome"