import previewOtherImagesType from "./PreviewOtherImagesType";
import {
  previewOtherImagesAction,
  previewOtherImagesActionType,
} from "./PreviewOtherImagesAction";

const otherImagesInitialState: previewOtherImagesType = [];

export default function previewOtherImages(
  state = otherImagesInitialState,
  action: previewOtherImagesActionType
) {
  switch (action.type) {
    case previewOtherImagesAction.PREVIEW_OTHER_IMAGES:
      return action.payload.otherImages;
    case previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES:
      return otherImagesInitialState;
    default:
      return state;
  }
}
