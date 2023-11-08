import { UIWidget } from "../../widget/interfaces/widget.interface";

export interface FromJsonResponse {
    attachRender: (ctx: ThisType<any>, renderFunction: (element: HTMLElement) => void) => UIWidget;
    getInstance: () => UIWidget;
}