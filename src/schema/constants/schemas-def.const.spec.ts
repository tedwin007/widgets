import Ajv from "ajv";
import {CreateWidgetSchema, EditWidgetSchema} from "./schemas-def.const";

const ajv = new Ajv();

describe('CreateWidgetSchema', () => {
    it('should match the validation result for valid data', () => {
        const validData = {
            config: {
                widgetProps: {}
            },
            version: '1.0.0'
        };

        const validate = ajv.compile(CreateWidgetSchema);
        const valid = validate(validData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });

    it('should match the validation result for incorrect data - missing config', () => {
        const invalidData = {
            id: '',
        };

        const validate = ajv.compile(CreateWidgetSchema);
        const valid = validate(invalidData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });
});

describe('EditWidgetSchema', () => {
    it('should match the validation result for valid data', () => {
        const validData = {
            config: {
                widgetProps: {}
            },
            version: '1.0.0',
            id: 'widget-001'
        };

        const validate = ajv.compile(EditWidgetSchema);
        const valid = validate(validData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });

    it('should match the validation result for incorrect data', () => {
        const invalidData = {
            config: {
                widgetProps: {}
            },
            version: '1.0.0'
        };

        const validate = ajv.compile(EditWidgetSchema);
        const valid = validate(invalidData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });


    it('should match the validation result for incorrect data - missing widgetProps', () => {
        const invalidData = {
            id: '',
            config: {},
            version: '1.0.0'
        };

        const validate = ajv.compile(EditWidgetSchema);
        const valid = validate(invalidData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });

    it('should match the validation result for incorrect data - missing config', () => {
        const invalidData = {
            id: '',
            version: '1.0.0'
        };

        const validate = ajv.compile(EditWidgetSchema);
        const valid = validate(invalidData);
        const validationResult = {
            valid,
            errors: validate.errors
        };
        expect(validationResult).toMatchSnapshot();
    });
});
