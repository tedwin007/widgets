import {CustomLogger} from "ajv";
import {Widget} from "../widget/widget.class";
import {NullLogger} from "../logger/null-logger.class";
import {SchemasMap} from "../schema/constants/schema.map";
import {BaseWidget, ToJsonResult, UIWidget} from "../widget/interfaces/widget.interface";
import {WidgetSchema} from "../schema/enums/schema-name.enum";
import {FromJsonResponse} from "./interfaces/widget-manager.interface";

/**
 * Manages widgets and provides methods for converting to/from JSON.
 */
export class WidgetManager {
    /**
     * Creates a new instance of the WidgetManager class.
     * @param {CustomLogger} _logger - Custom logger for error logging (default is NullLogger).
     */
    constructor(private _logger: CustomLogger = new NullLogger()) {
    }

    /**
     * Converts a BaseWidget instance from JSON representation to a Widget.
     * @param {BaseWidget} widget - The BaseWidget instance to convert.
     * @param {WidgetSchema} WidgetSchema - The schema name for validation.
     * @returns {FromJsonResponse} An object containing the Widget instance and attachRender method.
     */
    fromJson(
        widget: BaseWidget,
        WidgetSchema: WidgetSchema.Existing
    ): FromJsonResponse;

    /**
     * Converts a BaseWidget instance from JSON representation to a Widget.
     * @param {BaseWidget} widget - The BaseWidget instance to convert.
     * @param {WidgetSchema} widgetSchema - The schema name for validation.
     * @returns {FromJsonResponse} An object containing the Widget instance and attachRender method.
     */
    fromJson(
        widget: BaseWidget,
        widgetSchema?: WidgetSchema.New
    ): FromJsonResponse;

    /**
     * Converts a BaseWidget instance from JSON representation to a Widget with custom validation schema.
     * @param {BaseWidget} widget - The BaseWidget instance to convert.
     * @param {WidgetSchema} widgetSchema - The schema name for validation.
     * @param {object} schema - The custom validation schema to use.
     * @returns {FromJsonResponse} An object containing the Widget instance and attachRender method.
     */
    fromJson(
        widget: BaseWidget,
        widgetSchema: WidgetSchema.custom,
        schema: object
    ): FromJsonResponse;

    /**
     * Implementation of the fromJson method that performs the actual conversion.
     * @param {BaseWidget} widget - The BaseWidget instance to convert.
     * @param {WidgetSchema} widgetSchema - The schema name for validation.
     * @param {object} [schema] - Optional validation schema.
     * @returns {FromJsonResponse} An object containing the Widget instance and attachRender method.
     */
    fromJson(widget: BaseWidget, widgetSchema: WidgetSchema = WidgetSchema.New, schema?: object): FromJsonResponse {
        try {
            const validationSchema = schema || SchemasMap.get(widgetSchema);
            if (!validationSchema) throw new Error('unknown validation schema');
            const uiWidget: Widget = Widget.create(widget, validationSchema);
            /**
             * Attaches a render function to the Widget instance.
             * @param {HTMLElement} containerRef - The container element where the Widget will be rendered.
             * @param {any} ctx - The context for rendering.
             * @returns {Widget} Instance
             */
            return {
                getInstance: () => uiWidget,
                attachRender: function (ctx: ThisType<any>, renderFunction: (element: HTMLElement) => void): UIWidget {
                    uiWidget.render = renderFunction.bind(ctx);
                    return uiWidget
                }
            };
        } catch (err) {
            this._logger.error(err);
        }
    }

    /**
     * Converts a Widget instance to its JSON representation.
     * @param {Widget} widget - The Widget instance to convert.
     * @returns {ToJsonResult} The JSON representation of the Widget.
     */
    toJson(widget: Widget): ToJsonResult {
        try {
            return widget.toJson();
        } catch (err) {
            this._logger.error(err);
        }
    }
}
