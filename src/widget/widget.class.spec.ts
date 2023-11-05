import {Widget} from "./widget.class";
import {WidgetStatus} from "./enums/widget-status.enum";
import {SchemaValidator} from "../schema/schema-validator.class";

describe('Widget', () => {
    let mockWidgetConfig: any;
    let mockSchema: any;

    beforeEach(() => {
        mockWidgetConfig = {
            id: 'test-id',
            version: 'v1',
            config: {
                widgetProps: {
                    name: {
                        type: 'string'
                    }
                }
            }
        };
        mockSchema = {};
    });

    it('should create a new Widget instance when schema validation passes', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        } as any);

        const widget = Widget.create(mockWidgetConfig, mockSchema);
        expect(widget).toBeTruthy();
        expect(widget.id).toBe(mockWidgetConfig.id);
    });

    it('should throw an error when schema validation fails', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => {
                throw new Error('Schema validation failed');
            })
        } as any);

        expect(() => {
            Widget.create(mockWidgetConfig, mockSchema);
        }).toThrow('Schema validation failed');
    });

    it('should set data and update status to done', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation((input: any) => true)
        } as any);
        const widget = Widget.create(mockWidgetConfig, mockSchema);
        const mockData = {name: 'testName'};

        widget.setData(mockData);

        expect(widget.data).toEqual(mockData);
        expect(widget.status).toBe(WidgetStatus.done);
    });

    it('should throw an error when trying to set invalid data', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        } as any);
        const widget = Widget.create(mockWidgetConfig, mockSchema);
        const mockInvalidData = {name: 123}; // 'name' prop expects a string

        expect(() => {
            widget.setData(mockInvalidData);
        }).toThrow();
        expect(widget.status).toBe(WidgetStatus.failed);
    });


    it('should correctly convert the widget to JSON format', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        } as any);
        mockWidgetConfig = {
            id: 'test-id',
            config: {
                widgetProps: {
                    name: {
                        type: 'string'
                    }
                }
            }
        }
        const widget = Widget.create(mockWidgetConfig, mockSchema);
        const jsonResult = widget.toJson();
        expect(jsonResult.id).toBe(mockWidgetConfig.id);
        expect(jsonResult.version).toBe('test-id_v1'); // Assuming that the setVersion method appends "_v1" if version is not provided
        expect(jsonResult.config).toEqual(mockWidgetConfig.config);
    });

    it('should throw an error when render method is called', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        });
        const widget = Widget.create(mockWidgetConfig, mockSchema);

        expect(() => widget.render()).toThrow('No Render method was attached');
    });

    it('should throw an error if widgetProps is not defined', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        } as any);
        const widget = Widget.create({
            ...mockWidgetConfig,
            config: {}
        }, mockSchema);
        const mockData = {name: 'testName'};

        expect(() => widget.setData(mockData)).toThrow('widgetProps was not defined in the widget`s configuration');
    });

    it('should throw an error if prop type does not match widgetProps type definition', () => {
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        } as any);
        const widget = Widget.create(mockWidgetConfig, mockSchema);
        const mockInvalidData = {name: 12345};
        expect(() => widget.setData(mockInvalidData)).toThrow(`prop type ${mockInvalidData.name} does not match the widgetProps type definition (string)`);
    });

});

