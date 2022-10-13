import mainImageAndImagesType from './UploadMainImageAndImagesType';
type Action =
  | { type: 'UPLOAD_IMAGES'; payload: { images: mainImageAndImagesType } }
  | { type: 'RETURN_INITIAL_LISTING_IMAGES' };
const mainImageAndImagesEmptyState = {
  mainImage: null,
  images: [],
};
export default function UploadImages(state = mainImageAndImagesEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_IMAGES':
      return action.payload.images;
    case 'RETURN_INITIAL_LISTING_IMAGES':
      return mainImageAndImagesEmptyState;
    default:
      return state;
  }
}
