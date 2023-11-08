import {WidgetStatus} from "../enums/widget-status.enum";

export interface WithProps<T> {
    widgetProps: { [k in keyof T]: { type: T[k] } }
}

export type ToJsonResult = Record<keyof Pick<BaseWidget, 'config' | 'version' | 'id'>, string | WithProps<any>>;
export type RenderFunction<T = any> = () => T;

export interface BaseWidget<Data = any, Config = any> {
    id: string;
    version?: string;
    config: Config & WithProps<Data>,
    data?: Data,
    toJson?: () => ToJsonResult
    render?: RenderFunction<void>
}

export interface UIWidget extends BaseWidget {
    render: RenderFunction<void>;
    toJson: () => ToJsonResult;
    status: WidgetStatus;
}

export interface FromJsonResponse {
    attachRender: (ctx: ThisType<any>, renderFunction: (element: HTMLElement) => void) => UIWidget;
    getInstance: () => UIWidget;
}