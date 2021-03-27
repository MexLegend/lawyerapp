import { Plugin } from 'ckeditor5/src/core';

export default class AllowAttributes extends Plugin {
    constructor(editor) {
        super(editor);
    }

    init() {
        const editor = this.editor;

        editor.model.schema.extend('image', { allowAttributes: 'data-ide' });

        editor.conversion.for('upcast').attributeToAttribute({
            model: {
                key: 'data-ide',
                name: 'image'
            },
            view: 'data-ide'
        });

        editor.conversion.for("downcast").add((dispatcher) => {
            dispatcher.on("attribute:data-ide:image", (evt, data, conversionApi) => {
                if (!conversionApi.consumable.consume(data.item, evt.name)) {
                    return;
                }

                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement(data.item);
                const img = figure.getChild(0);

                if (data.attributeNewValue !== null) {
                    viewWriter.setAttribute("data-ide", data.attributeNewValue, img);
                } else {
                    viewWriter.removeAttribute("data-ide", img);
                }
            });
        });
    }
}
