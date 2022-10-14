import previewMainImageType from './PreviewMainImageType';
enum previewMainImageAction {
  PREVIEW_MAIN_IMAGE = 'PREVIEW_MAIN_IMAGE',
  RETURN_INITIAL_IMAGE = 'RETURN_INITIAL_IMAGE',
}

interface previewMainImage {
  type: previewMainImageAction.PREVIEW_MAIN_IMAGE;
  payload: { mainImage: previewMainImageType };
}

interface returnInitialMainImage {
  type: previewMainImageAction.RETURN_INITIAL_IMAGE;
}

type previewMainImageActionType = previewMainImage | returnInitialMainImage;
export { previewMainImageAction, previewMainImageActionType };
