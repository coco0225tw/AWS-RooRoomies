import mainImageAndImagesType from './UploadMainImageAndImagesType';

enum uploadImagesAction {
  UPLOAD_IMAGES = 'UPLOAD_IMAGES',
  RETURN_INITIAL_LISTING_IMAGES = 'RETURN_INITIAL_LISTING_IMAGES',
}

interface uploadImages {
  type: uploadImagesAction.UPLOAD_IMAGES;
  payload: { images: mainImageAndImagesType };
}

interface returnInitialImages {
  type: uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES;
}

type uploadImagesActionType = uploadImages | returnInitialImages;
export { uploadImagesAction, uploadImagesActionType };
