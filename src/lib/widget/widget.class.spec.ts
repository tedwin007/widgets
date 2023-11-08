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
            verify: jest.fn().mockImplementation((): boolean => true)
        } as any);
        const widget = Widget.create(mockWidgetConfig, mockSchema);
        const mockData = {name: 'testName'};

        widget.setData(mockData);

        expect(widget.data).toEqual(mockData);
        expect(widget.status).toBe(WidgetStatus.done);
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
        expect(jsonResult.version).toBe('test-id_v1');
        expect(jsonResult.config).toEqual(mockWidgetConfig.config);
    });

    it('should throw an error when render method is called', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(SchemaValidator, 'createValidator').mockReturnValue({
            verify: jest.fn().mockImplementation(() => true)
        });
        const widget = Widget.create(mockWidgetConfig, mockSchema);

        expect(() => widget.render({} as any)).toThrow('No Render method was attached');
    });

});

