import mainImageAndImagesType from './UploadMainImageAndImagesType';

enum uploadImagesAction {
  UPLOAD_IMAGES = 'UPLOAD_IMAGES',
  UPLOAD_MAIN_IMAGE = 'UPLOAD_MAIN_IMAGE',
  DELETE_MAIN_IMAGE = 'DELETE_MAIN_IMAGE',
  DELETE_OTHER_IMAGE = 'DELETE_OTHER_IMAGE',
  RETURN_INITIAL_LISTING_IMAGES = 'RETURN_INITIAL_LISTING_IMAGES',
}

interface uploadImages {
  type: uploadImagesAction.UPLOAD_IMAGES;
  payload: { images: Blob[] };
}
interface uploadMainImage {
  type: uploadImagesAction.UPLOAD_MAIN_IMAGE;
  payload: { mainImage: Blob };
}
interface deleteMainImage {
  type: uploadImagesAction.DELETE_MAIN_IMAGE;
}
interface deleteOtherImage {
  type: uploadImagesAction.DELETE_OTHER_IMAGE;
  payload: { index: number };
}
interface returnInitialImages {
  type: uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES;
}

type uploadImagesActionType = uploadImages | returnInitialImages | deleteMainImage | deleteOtherImage | uploadMainImage;
export { uploadImagesAction, uploadImagesActionType };
