import previewOtherImagesType from './PreviewOtherImagesType';
import { previewOtherImagesAction, previewOtherImagesActionType } from './PreviewOtherImagesAction';

const otherImagesInitialState: previewOtherImagesType = [];

export default function previewOtherImages(state = otherImagesInitialState, action: previewOtherImagesActionType) {
  switch (action.type) {
    case previewOtherImagesAction.PREVIEW_OTHER_IMAGES:
      return action.payload.otherImages;
    case previewOtherImagesAction.DELETE_OTHER_IMAGE:
      return state.filter((url) => url !== action.payload.url);
    case previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES:
      return [];
    default:
      return state;
  }
}
