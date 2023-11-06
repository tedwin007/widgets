import {BaseWidget, ToJsonResult, WithProps} from "./interfaces/widget.interface";
import {WidgetStatus} from "./enums/widget-status.enum";
import {SchemaValidator} from "../schema/schema-validator.class";

let globalIndex = 0;

/**
 * Represents a widget with customizable properties and data.
 * @template T - The type of data associated with the widget.
 */
export class Widget<T = any> implements BaseWidget<T> {
    /**
     * The unique identifier for the widget.
     */
    id!: string;
    /**
     * The version of the widget.
     */
    version!: string;
    /**
     * The current status of the widget.
     */
    status!: WidgetStatus;
    /**
     * Configuration properties and types associated with the widget.
     */
    config!: WithProps<T>;
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
                err.message += `enriched: source->Widget.create | data: widget=${JSON.stringify(widgetConf)} | schema = ${schema}`;
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
            this.validateWidgetData(data);
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
    render(): void {
        throw new Error('No Render method was attached');
    }

    /**
     * Generates a unique identifier for the widget.
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
     * @param {BaseWidget} widget - The widget configuration.
     * @private
     */
    private setVersion(widget: BaseWidget<any, any>): void {
        this.version = widget.version || `${this.id}_v1`;
    }

    /**
     * todo: [WIP]
     * Validates the data associated with the widget based on its configuration.
     * @param {T} data - The data to validate.
     * @throws {Error} If the data fails validation.
     * @private
     */
    private validateWidgetData(data: T): void {
        for (const key in data) {
            if (!('widgetProps' in this.config)) throw new Error('widgetProps was not defined in the widget\'s configuration');
            if (!(key in this.config.widgetProps)) throw new Error('Key: ' + key + " was not found in widgetProps definition");
            const prop = data[key];
            const widgetProp = this.config.widgetProps[key];
            if (typeof prop !== widgetProp.type) throw new Error(`prop type ${data[key]} does not match the widgetProps type definition (${widgetProp.type})`);
        }
    }
}
