import {WidgetManager} from "./widget-manager.class";
import {Widget} from "../widget/widget.class";
import {SchemasMap} from "../schema/constants/schem.map";
import {WidgetSchema} from "../schema/enums/schema-name.enum";

jest.mock('./../widget/widget.class');  // Path to your Widget class

describe('WidgetManager', () => {
    let widgetManager: WidgetManager;
    const mockLogger = {
        error: jest.fn()
    };
    const mockWidgetInstance = {
        toJson: jest.fn(),
        render: jest.fn()
    };

    beforeEach(() => {
        // Clearing mock states
        jest.clearAllMocks();

        widgetManager = new WidgetManager(mockLogger as any);
        (Widget as jest.Mocked<typeof Widget>).create.mockReturnValue(mockWidgetInstance as any);
    });

    describe('fromJson', () => {

        it('should return a widget instance for valid input', () => {
            const mockWidget = {
                id: 'test-id',
                version:'',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            jest.spyOn(SchemasMap, 'get').mockReturnValue({});

            const result = widgetManager.fromJson(mockWidget, WidgetSchema.New);
            expect(result).toBeDefined();
            expect(result.getInstance()).toBe(mockWidgetInstance);
        });

        it('should use custom schema if provided', () => {
            const mockWidget = {
                id: 'test-id',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            const customSchema = { type: 'custom' };

            widgetManager.fromJson(mockWidget, WidgetSchema.custom, customSchema);

            expect(Widget.create).toHaveBeenCalledWith(mockWidget, customSchema);
        });

        it('should use editWidget schema if SchemaName.editWidget is provided', () => {
            const mockWidget = {
                id: 'test-id',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            jest.spyOn(SchemasMap, 'get').mockReturnValueOnce({ type: 'editWidget' });

            widgetManager.fromJson(mockWidget, WidgetSchema.Existing);

            expect(Widget.create).toHaveBeenCalledWith(mockWidget, { type: 'editWidget' });
        });

        it('should use createWidget schema if SchemaName.createWidget is provided', () => {
            const mockWidget = {
                id: 'test-id',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            jest.spyOn(SchemasMap, 'get').mockReturnValueOnce({ type: 'createWidget' });

            widgetManager.fromJson(mockWidget, WidgetSchema.New);

            expect(Widget.create).toHaveBeenCalledWith(mockWidget, { type: 'createWidget' });
        });

        it('should log an error if provided SchemaName is not found in SchemasMap', () => {
            const mockWidget = {
                id: 'test-id',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            const nonexistentSchemaName = 'nonexistentSchema';

            jest.spyOn(SchemasMap, 'get').mockReturnValueOnce(undefined);

            widgetManager.fromJson(mockWidget, nonexistentSchemaName as any);

            expect(mockLogger.error).toHaveBeenCalled();
            expect(Widget.create).not.toHaveBeenCalled();
        });

        it('should log an error for invalid widget creation', () => {
            const mockWidget = {
                id: 'test-id',
                config: {
                    widgetProps: {
                        name: { type: 'string' }
                    }
                }
            };
            const mockError = new Error('Creation failed');

            jest.spyOn(SchemasMap, 'get').mockReturnValue({ type: 'createWidget' });
            (Widget as jest.Mocked<typeof Widget>).create.mockImplementation(() => {
                throw mockError;
            });

            widgetManager.fromJson(mockWidget, WidgetSchema.New);

            expect(mockLogger.error).toHaveBeenCalledWith(mockError);
        });
    });

    describe('toJson', () => {
        it('should call the toJson method of Widget instance', () => {
            widgetManager.toJson(mockWidgetInstance as any);
            expect(mockWidgetInstance.toJson).toHaveBeenCalled();
        });

        it('should log an error if toJson method throws an exception', () => {
            const mockError = new Error('toJson failed');
            mockWidgetInstance.toJson.mockImplementation(() => {
                throw mockError;
            });

            widgetManager.toJson(mockWidgetInstance as any);

            expect(mockLogger.error).toHaveBeenCalledWith(mockError);
        });
    });
});
