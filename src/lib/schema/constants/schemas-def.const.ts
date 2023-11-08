export const CreateWidgetSchema = {
    type: "object",
    properties: {
        config: {
            type: "object",
            description: "Widget Config",
            additionalProperties: true,
            properties: {}
        },
        widgetProps: {
            type: "object",
            description: "This defines the widget's component props ( @Input )",
            additionalProperties: true,
            properties: {}
        },
        data: {
            $ref: "#/properties/widgetProps"
        }
    },
    required: ["config"],
    additionalProperties: false,
} as const;

export const EditWidgetSchema = {
    type: "object",
    properties: {
        widgetProps: {
            type: "object",
            description: "This defines the widget's component props ( @Input )",
            additionalProperties: true,
            properties: {}
        },
        config: {
            type: "object",
            description: "Widget Config",
            additionalProperties: true,
            properties: {}
        },
        version: {
            type: "string",
            description: "Widget's Version",
        },
        id: {
            type: "string",
            description: "Widget's ID",
        },
        data: {
            $ref: "#/properties/widgetProps"
        }
    },
    required: ["config", "version", "id", 'widgetProps'],
    additionalProperties: false,
} as const;

