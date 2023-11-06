import {CreateWidgetSchema, EditWidgetSchema} from "./schemas-def.const";
import {WidgetSchema} from "../enums/schema-name.enum";

export const SchemasMap = new Map<WidgetSchema, object>([
    [WidgetSchema.New, CreateWidgetSchema],
    [WidgetSchema.Existing, EditWidgetSchema]
])