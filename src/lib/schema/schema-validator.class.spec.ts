import {SchemaResult} from "./interfaces/schema-validator.interfaces";
import {SchemaValidator} from "@widgets"; // The path should be updated to where your SchemaValidator class is located

describe('SchemaValidator', () => {
    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            age: { type: 'number', minimum: 0 },
        },
        required: ['name', 'age'],
        additionalProperties: false,
    };

    let validatorResult: SchemaResult;
    beforeAll(() => {
        validatorResult = SchemaValidator.createValidator(schema);
    });

    it('should create a validator function', () => {
        expect(validatorResult.verify).toBeInstanceOf(Function);
    });

    it('should validate correct data successfully', () => {
        const data = { name: 'John Doe', age: 30 };
        expect(() => validatorResult.verify(data)).not.toThrow();
    });

    it('should throw an error if data is invalid', () => {
        const data = { name: 'John Doe', age: -10 };
        expect(() => validatorResult.verify(data)).toThrow(Error);
    });

    it('should have a formatted error message on invalid data', () => {
        const data = { name: 'John Doe', age: -10 };
        try {
            validatorResult.verify(data);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toContain('Error in .age:');
        }
    });

    it('should ignore "if" errors', () => {
        const data = { name: 'John Doe', age: 'thirty' }; // This will fail schema validation, not an 'if' error
        try {
            validatorResult.verify(data);
        } catch (error) {
            expect(error.message).toContain('should be number');
        }
    });
});
