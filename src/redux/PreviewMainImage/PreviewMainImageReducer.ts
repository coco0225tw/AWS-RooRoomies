import {
  previewMainImageAction,
  previewMainImageActionType,
} from "./PreviewMainImageAction";
import previewMainImageType from "./PreviewMainImageType";

const mainImageInitialState: previewMainImageType = "";

export default function previewMainImage(
  state = mainImageInitialState,
  action: previewMainImageActionType
) {
  switch (action.type) {
    case previewMainImageAction.PREVIEW_MAIN_IMAGE:
      return action.payload.mainImage;
    case previewMainImageAction.RETURN_INITIAL_IMAGE:
      return mainImageInitialState;
    default:
      return state;
  }
}
