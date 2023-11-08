import {BaseWidget, ToJsonResult} from "./interfaces/widget.interface";
import {WidgetStatus} from "./enums/widget-status.enum";
import {SchemaValidator} from "../schema/schema-validator.class";

let globalIndex = 0;

/**
 * @deprecated
 * todo
 * This is a util function for unit tests ONLY
 */
export function initGlobalIndex() {
    globalIndex = 0;
}

/**
 * Represents a widget with customizable properties and data.
 * @template C - The type of configuration associated with the widget.
 * @template T - The type of data associated with the widget. */
export class Widget<T = any, C = any> implements BaseWidget<T> {
    widgetProps: Partial<T>
    /**
     * The unique identifier for the widget.
     */
    id!: string;
    /**
     * The version of the widget.
     * @see {setVersion}
     */
    version!: string;
    /**
     * The current status of the widget.
     */
    status: WidgetStatus = WidgetStatus.loading;
    /**
     * Configuration properties and types associated with the widget.
     */
    config!: C
    /**
     * The data associated with the widget.
     */
    data!: T;

    /**
     * Creates a new instance of the Widget class.
     * @param {BaseWidget} widget - The initial configuration of the widget.
     * @protected
     */
    protected constructor(widget: BaseWidget) {
        this.setId(widget);
        this.setVersion(widget);
        this.config = widget.config;
        this.widgetProps = widget.widgetProps || {}
        this.setData(widget?.data || {});
        this.setStatus(WidgetStatus.loading);
    }

    /**
     * Creates a new Widget instance based on the provided configuration and schema.
     * @param {BaseWidget} widgetConf - The initial configuration of the widget.
     * @param {object} schema - The validation schema to use.
     * @returns {Widget} A new Widget instance.
     * @throws {Error} If the provided configuration fails validation.
     */
    static create(widgetConf: BaseWidget, schema: object): Widget {
        try {
            SchemaValidator.createValidator(schema).verify(widgetConf);
            return new Widget(widgetConf);
        } catch (err) {
            if (err instanceof Error) {
                err.message += ` 
                Source -> Widget.create method -> ${err?.stack} |
                Widget = ${JSON.stringify(widgetConf, null, 2)} |
                Schema = ${JSON.stringify(schema, null, 2)}`;
                throw err;
            }
        }
    }

    /**
     * Sets the data associated with the widget and updates its status.
     * @param {T} data - The data to associate with the widget.
     * @throws {Error} If the provided data fails validation.
     */
    setData(data: T): void {
        try {
            this.data = data;
            this.status = WidgetStatus.done;
        } catch (err) {
            this.status = WidgetStatus.failed;
            if (err instanceof Error) throw err;
        }
    }

    /**
     * Converts the widget to its JSON representation.
     * @returns {ToJsonResult} The JSON representation of the widget.
     */
    toJson(): ToJsonResult {
        return {
            widgetProps: this.widgetProps,
            id: this.id,
            version: this.version,
            config: this.config,
        };
    }

    /**
     * Renders the widget.
     * @description Before calling this method you should call WidgetManger.attachRender() method
     * to replace this implementation
     * @throws {Error} If no render method is attached to the widget.
     */
    render(element: HTMLElement): void {
        throw new Error('No Render method was attached');
    }

    /**
     * Generates a unique identifier for the widget.
     - When the widget first get created it receive the following format <Time>_<globalIndex> ({@link WidgetSchema.New})
     - When the widgets gets loaded from a persistent storage, iw already have id which  will be assigned to the widget instance  ({@link WidgetSchema.Existing})
     * @param {BaseWidget} widget - The widget configuration.
     * @private
     */
    private setId(widget: BaseWidget<any, any>): void {
        globalIndex += 1;
        this.id = widget.id || `${new Date().getTime()}_${globalIndex}`;
    }

    /**
     * Sets the status of the widget.
     * @param {WidgetStatus} status - The status to set.
     * @private
     */
    private setStatus(status: WidgetStatus): void {
        this.status = status;
    }

    /**
     * Sets the version of the widget.
     * - When the widget first get created it receive the following format "<Time>_<globalIndex>_v1" ({@link WidgetSchema.New})
     * - When the widgets gets loaded from a persistent storage, iw already have version which will be assigned to the widget instance ({@link WidgetSchema.Existing})
     * @param {BaseWidget} widget - The widget configuration.
     * @private
     */
    private setVersion(widget: BaseWidget<any, any>): void {
        this.version = widget.version || `${this.id}_v1`;
    }
}
