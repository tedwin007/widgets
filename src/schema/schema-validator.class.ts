import Ajv, {ValidateFunction} from "ajv";
import {SchemaResult} from "./interfaces/schema-validator.interfaces";

export class SchemaValidator {
    private static ajv = new Ajv( {
        allErrors: true,
        uniqueItems: true,
        jsonPointers: true,
        missingRefs: "fail",
        async: true,
    });

    static createValidator(schema: object): SchemaResult {
        const validateFunction = this.ajv.compile(schema);
        const verify = this.verify(validateFunction);
        return {schema, verify};
    };

    private static verify = (validate: ValidateFunction) => (data) => {
        const isValid = validate(data);
        if (isValid) return data;
        throw new Error(
            this.ajv.errorsText(
                validate.errors?.filter((err) => err.keyword !== "if"),
                {dataVar: "schemaValidation"}
            )
        );
    }
}