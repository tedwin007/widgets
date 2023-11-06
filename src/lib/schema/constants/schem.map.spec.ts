import {SchemasMap} from "./schem.map";
import {WidgetSchema} from "../enums/schema-name.enum";

describe('SchemasMap', () => {
    it('should match the snapshot of the createWidget schema', () => {
        const schema = SchemasMap.get(WidgetSchema.New);
        expect(schema).toMatchSnapshot();
    });

    it('should match the snapshot of the editWidget schema', () => {
        const schema = SchemasMap.get(WidgetSchema.Existing);
        expect(schema).toMatchSnapshot();
    });
});
