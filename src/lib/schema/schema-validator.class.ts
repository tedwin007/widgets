import {SchemaResult} from "./interfaces/schema-validator.interfaces";
import * as Ajv from "ajv";
import {ErrorObject} from "ajv";

export class SchemaValidator {
    private static ERROR_TYPE = 'Widget Schema'

    private static ajv = new Ajv({allErrors: true});

    static createValidator(schema: object): SchemaResult {
        const validateFunction = this.ajv.compile(schema);
        const verify = this.verify(validateFunction);
        return {schema, verify};
    };


    private static verify = (validate: Ajv.ValidateFunction) => (data:any) => {
        const isValid = validate(data);
        if (isValid) return data;
        throw new Error(formatAjvErrors(validate.errors, this.ERROR_TYPE));

        function formatAjvErrors(errors: ErrorObject[], dataVar: string) {
            return JSON.stringify(errors
                .filter((err: ErrorObject) => err.keyword !== 'if')
                .map((err: ErrorObject) => `${new Date().toISOString()} - [${dataVar}] Error in ${err.dataPath}: ${err.message}`)
                .join('\n'), null, 2);
        }
    }
}