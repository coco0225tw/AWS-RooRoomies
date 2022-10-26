import mainImageAndImagesType from './UploadMainImageAndImagesType';
import { uploadImagesAction, uploadImagesActionType } from './UploadMainImageAndImagesAction';

const mainImageAndImagesEmptyState: mainImageAndImagesType = {
  mainImage: null,
  images: [],
};
export default function UploadImages(state = mainImageAndImagesEmptyState, action: uploadImagesActionType) {
  switch (action.type) {
    case uploadImagesAction.UPLOAD_IMAGES: {
      let newState = { ...state, images: action.payload.images };
      return newState;
    }
    case uploadImagesAction.UPLOAD_MAIN_IMAGE: {
      let newState = { ...state, mainImage: action.payload.mainImage };
      return newState;
    }
    case uploadImagesAction.DELETE_MAIN_IMAGE: {
      let newState = { ...state, mainImage: null };
      return newState;
    }
    case uploadImagesAction.DELETE_OTHER_IMAGE: {
      let newImages = [...state.images];
      let filterImages = newImages.filter((blob, index) => index !== action.payload.index);
      let newState = { ...state, images: filterImages };
      return newState;
    }
    case uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES:
      return mainImageAndImagesEmptyState;
    default:
      return state;
  }
}
