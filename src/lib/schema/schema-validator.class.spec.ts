import {SchemaValidator} from "./schema-validator.class";

describe('SchemaValidator', () => {
    const mockSchema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            age: { type: 'number' },
        },
        required: ['name'],
    };

    it('should create a validator and verify valid data', () => {
        const validatorResult = SchemaValidator.createValidator(mockSchema);
        const data = { name: 'John', age: 30 };
        const validatedData = validatorResult.verify(data);
        expect(validatedData).toEqual(data);
    });

    it('should create a validator and throw an error for invalid data', () => {
        const validatorResult = SchemaValidator.createValidator(mockSchema);
        const invalidData = { age: 30 };
        expect(() => validatorResult.verify(invalidData)).toThrowError(
            "schemaValidation should have required property 'name'"
        );
    });
});
