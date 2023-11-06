import {ValidateFunction} from "ajv";

export interface SchemaResult {
    schema: object;
    verify: ValidateFunction
}