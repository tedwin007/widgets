import {WidgetStatus} from "../enums/widget-status.enum";

export interface WithProps<T> {
    widgetProps: { [k in keyof T]: { type: T[k] } }
}

export type ToJsonResult = Record<keyof Pick<BaseWidget, 'config' | 'version' | 'id' | 'widgetProps'>, string | any>;
export type RenderFunction<T = any> = (element: HTMLElement) => T;

export interface BaseWidget<Data = any, Config = any> {
    widgetProps: Partial<Data>
    id?: string;
    version?: string;
    config: Config,
    data?: Data,
    toJson?: () => ToJsonResult
    render?: RenderFunction<void>
}

export interface UIWidget extends BaseWidget {
    render: RenderFunction<void>;
    toJson: () => ToJsonResult;
    status: WidgetStatus;
}

