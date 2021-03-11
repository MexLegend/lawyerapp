import { Plugin, icons } from 'ckeditor5/src/core';
import { FileDialogButtonView } from 'ckeditor5/src/upload';
import { createImageTypeRegExp } from '@ckeditor/ckeditor5-image/src/imageupload/utils';

export default class ImageUpload extends Plugin {

    init() {
        const editor = this.editor;
        const t = editor.t;
        const componentCreator = locale => {
            const view = new FileDialogButtonView(locale);
            // const command = editor.commands.get('uploadImage');
            const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jfif'];
            const imageTypesRegExp = createImageTypeRegExp(imageTypes);

            view.set({
                acceptedType: imageTypes.map(type => `image/${type}`).join(','),
                allowMultipleFiles: true
            });

            console.log(view);
            console.log(view.element);

            // view.element.lastChild.id.setAttribute("id", "insertPostImage");

            view.buttonView.set({
                label: t('Insertar imagen'),
                icon: icons.image,
                tooltip: true
            });

            view.on('done', (evt, files) => {
                let image;
                const imagesToUpload = Array.from(files).filter(file => imageTypesRegExp.test(file.type));

                // Render Image Preview After Adding File Item
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    image = reader.result.toString();
                });
                reader.readAsDataURL(imagesToUpload);

                console.log(image);

                // Insert the image in the current selection location.
                // editor.model.insertContent(imageElement, editor.model.document.selection);

            });

            return view;
        };

        // Setup `insertImage` button.
        editor.ui.componentFactory.add('insertImage', componentCreator);
    }
}
