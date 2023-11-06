export const CreateWidgetSchema = {
    type: "object",
    properties: {
        config: {
            widgetProps: {
                type: Object,
                description: "This defines the widget's component props ( @Input )",
                additionalProperties: true,
            }
        },
        version: {
            type: "string",
            description: "Widget Config",
        }
    },
    required: ["config"],
    additionalProperties: false,
};

export const EditWidgetSchema = {
    type: "object",
    properties: {
        config: {
            widgetProps: {
                type: Object,
                description: "This defines the widget's component props ( @Input )",
                additionalProperties: true,
            },
            required: ["widgetProps"],
        },
        version: {
            type: "string",
            description: "Widget Config",
        },
        id: {
            type: "string",
            description: "Widget's ID",
        }
    },
    optionalProperties: {
        data: {
            type: "object"
        }
    },
    required: ["config", "version", "id"],
    additionalProperties: false,
};

