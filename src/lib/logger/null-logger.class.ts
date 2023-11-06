import {CustomLogger} from "./interfaces/custom-logger.interface";


export class NullLogger implements CustomLogger {

    error(...args: (string | Error)[]): null {
        return null
    }

    log(...args: (string | Error)[]): null {
        return null
    }

    warn(...args: (string | Error)[]): null {
        return null
    }

}