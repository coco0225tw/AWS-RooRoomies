import previewOtherImagesType from "./PreviewOtherImagesType";
enum previewOtherImagesAction {
  PREVIEW_OTHER_IMAGES = "PREVIEW_OTHER_IMAGES",
  RETURN_INITIAL_OTHER_IMAGES = "RETURN_INITIAL_OTHER_IMAGES",
}

interface previewOtherImages {
  type: previewOtherImagesAction.PREVIEW_OTHER_IMAGES;
  payload: { otherImages: previewOtherImagesType };
}

interface returnInitialOtherImages {
  type: previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES;
}

type previewOtherImagesActionType =
  | previewOtherImages
  | returnInitialOtherImages;

export { previewOtherImagesAction, previewOtherImagesActionType };
