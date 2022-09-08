import mainImageAndImagesType from './UploadMainImageAndImagesType';
type Action = { type: 'UPLOAD_IMAGES'; payload: { images: mainImageAndImagesType } };
const mainImageAndImagesEmptyState = {
  mainImage: null,
  images: [],
};
export default function UploadImages(state = mainImageAndImagesEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_IMAGES':
      console.log(action.payload);
      return action.payload.images;
    default:
      return state;
  }
}
