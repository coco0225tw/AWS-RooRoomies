import previewOtherImagesType from './PreviewOtherImagesType';
enum previewOtherImagesAction {
  PREVIEW_OTHER_IMAGES = 'PREVIEW_OTHER_IMAGES',
  DELETE_OTHER_IMAGE = 'DELETE_OTHER_IMAGE',
  RETURN_INITIAL_OTHER_IMAGES = 'RETURN_INITIAL_OTHER_IMAGES',
}

interface previewOtherImages {
  type: previewOtherImagesAction.PREVIEW_OTHER_IMAGES;
  payload: { otherImages: previewOtherImagesType };
}
interface deleteOtherImage {
  type: previewOtherImagesAction.DELETE_OTHER_IMAGE;
  payload: { url: string };
}
interface returnInitialOtherImages {
  type: previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES;
}

type previewOtherImagesActionType = previewOtherImages | deleteOtherImage | returnInitialOtherImages;

export { previewOtherImagesAction, previewOtherImagesActionType };
