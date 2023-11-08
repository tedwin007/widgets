import {initGlobalIndex, Widget} from '../widget/widget.class';
import {NullLogger} from '../logger/null-logger.class';
import {WidgetSchema} from '../schema/enums/schema-name.enum';
import {BaseWidget, WidgetManager} from "@widgets";
import spyOn = jest.spyOn;

interface WidgetData {
    title: string;
    content: string;
}

interface WidgetConfig {
    theme: string;
    layout: string;
}

const mockExsistingWidget: BaseWidget<WidgetData, WidgetConfig> = {
    id: 'widget-123',
    version: '1.0.0',
    config: {
        theme: 'light',
        layout: 'fixed'
    },
    data: {
        title: 'My Widget',
        content: 'This is my widget content'
    },
    widgetProps: {
        title: 'My Partial Widget'
    },
};

const mockNewWidget: any = {
    config: {
        theme: 'light',
        layout: 'fixed'
    },
    widgetProps: {
        title: 'My Partial Widget'
    },
};


describe('WidgetManager', () => {
    let widgetManager: WidgetManager;
    let mockLogger;
    let createSpy
    beforeEach(() => {
        mockLogger = new NullLogger();
        widgetManager = new WidgetManager(mockLogger);
        createSpy = jest.spyOn(Widget, 'create')
        initGlobalIndex()
    });

    describe('fromJson', () => {
        it('should convert a BaseWidget from JSON using an existing schema', () => {
            const widgetSchema = WidgetSchema.Existing;
            const result = widgetManager.fromJson(mockExsistingWidget, widgetSchema);
            expect(Widget.create).toHaveBeenCalled();
            expect(result.getInstance()).toBeDefined();
        });

        it('should handle unknown validation schema', () => {
            const widgetSchema = 'unknown';
            const errorSpy = spyOn(mockLogger, 'error')
            const result = widgetManager.fromJson(mockExsistingWidget, widgetSchema as any);
            expect(result).toBeUndefined();
            expect(errorSpy).toHaveBeenCalled();
        });

        it('should convert a BaseWidget from JSON using a new schema', () => {
            const result = widgetManager.fromJson(mockNewWidget);
            expect(createSpy).toHaveBeenCalledWith(mockNewWidget, expect.anything());
            const instance = result.getInstance();
            expect(instance).toHaveProperty('id');
            expect(instance.id).toContain('_1');
            expect(instance).toHaveProperty('version');
            expect(instance.version).toContain('_1_v1');

        });

        it('should convert a BaseWidget from JSON using a custom schema', () => {
            const widgetSchema = WidgetSchema.custom;
            const customSchema = {
                "type": "object",
                "properties": {
                    "config": {
                        "type": "object",
                        "properties": {
                            "theme": {
                                "type": "string",
                                "enum": ["light", "dark", "other"]
                            },
                            "layout": {
                                "type": "string",
                                "enum": ["fixed", "responsive", "other"]
                            }
                        },
                        "required": ["theme", "layout"],
                        "additionalProperties": false
                    },
                    "widgetProps": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": true
                    }
                },
                "required": ["config", "widgetProps"],
                "additionalProperties": false
                }
            ;

            const result = widgetManager.fromJson(mockNewWidget, widgetSchema, customSchema);
            expect(Widget.create).toHaveBeenCalledWith(mockNewWidget, customSchema);
            expect(result.getInstance()).toHaveProperty('status');
            expect(result.getInstance()).toHaveProperty('id');
            expect(result.getInstance()).toHaveProperty('version');
            expect(result.getInstance().config).toEqual(mockNewWidget.config);
            expect(result.getInstance().widgetProps).toEqual(mockNewWidget.widgetProps);
            expect(result.getInstance().data).toEqual({});
        });

        it('should throw error if the validation schema is missing', () => {
            const baseWidget = {type: 'noSchemaWidget'};
            const widgetSchema = 'unknown';
            const errorSpy = spyOn(mockLogger, 'error')
            widgetManager.fromJson(baseWidget as any, widgetSchema as any);
            expect(errorSpy).toHaveBeenCalled();
        });


        it('should attach a render function to the Widget instance', () => {
            const widgetSchema = WidgetSchema.Existing;
            const mockContainerRef = {selector: '.x'} as any
            const mockContext = {};
            const mockRenderFunction = jest.fn();
            const result = widgetManager.fromJson(mockExsistingWidget, widgetSchema);
            const widgetInstance = result.attachRender(mockContext, mockRenderFunction);
            widgetInstance.render(mockContainerRef);
            expect(mockRenderFunction).toHaveBeenCalledWith(mockContainerRef);
        });
    });

    describe('toJson', () => {
        it('should call a Widget.toJson when triggered from WidgetManger', () => {

            const widget = widgetManager.fromJson(mockNewWidget).getInstance() as any
            widget.toJson = jest.fn()

            widgetManager.toJson(widget);
            expect(widget.toJson).toHaveBeenCalled();
        });

        it('should convert a Widget instance to its JSON representation ', () => {
            const widget = widgetManager.fromJson(mockNewWidget).getInstance() as any
            const result = widgetManager.toJson(widget) as any;
            expect(result.config).toEqual(widget.config);
            expect(result.widgetProps).toEqual(widget.widgetProps);
            expect(result.id).toContain('_1');
            expect(result.version).toContain('_1_v1');
        });

        it('should handle errors during conversion to JSON', () => {
            const errorSpy = spyOn(mockLogger, 'error')

            const widget = widgetManager.fromJson(mockNewWidget).getInstance() as any
            const error = new Error('Conversion failed');
            widget.toJson = jest.fn().mockImplementation(() => {
                throw error;
            });
            const result = widgetManager.toJson(widget);
            expect(result).toBeUndefined();
            expect(errorSpy).toHaveBeenCalledWith(error);
        });

        it('should not convert a Widget instance to JSON if the widget is null', () => {
            const errorSpy = spyOn(mockLogger, 'error')
            const result = widgetManager.toJson(null);
            expect(result).toBeUndefined();
            expect(errorSpy).toHaveBeenCalled();
        });

        it('should not convert a Widget instance to JSON if the widget is undefined', () => {
            const errorSpy = spyOn(mockLogger, 'error')
            const result = widgetManager.toJson(undefined);
            expect(result).toBeUndefined();
            expect(errorSpy).toHaveBeenCalled();
        });
    });
});
