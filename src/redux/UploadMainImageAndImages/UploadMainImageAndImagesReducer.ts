import mainImageAndImagesType from './UploadMainImageAndImagesType';
import { uploadImagesAction, uploadImagesActionType } from './UploadMainImageAndImagesAction';

const mainImageAndImagesEmptyState: mainImageAndImagesType = {
  mainImage: null,
  images: [],
};
export default function UploadImages(state = mainImageAndImagesEmptyState, action: uploadImagesActionType) {
  switch (action.type) {
    case uploadImagesAction.UPLOAD_IMAGES:
      return action.payload.images;
    case uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES:
      return mainImageAndImagesEmptyState;
    default:
      return state;
  }
}
