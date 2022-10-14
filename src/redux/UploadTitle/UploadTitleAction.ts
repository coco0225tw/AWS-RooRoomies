import titleType from './UploadTitleType';
enum uploadTitleAction {
  UPLOAD_TITLE = 'UPLOAD_TITLE',
  GET_LISTING_TITLE_FROM_FIREBASE = 'GET_LISTING_TITLE_FROM_FIREBASE',
  RETURN_INITIAL_TITLE = 'RETURN_INITIAL_TITLE',
}

interface uploadTitle {
  type: uploadTitleAction.UPLOAD_TITLE;
  payload: { titleState: titleType };
}
interface getListingFromFirebase {
  type: uploadTitleAction.GET_LISTING_TITLE_FROM_FIREBASE;
  payload: { listingTitle: titleType };
}
interface returnInitialTitle {
  type: uploadTitleAction.RETURN_INITIAL_TITLE;
}

type uploadTitleActionType = uploadTitle | getListingFromFirebase | returnInitialTitle;

export { uploadTitleAction, uploadTitleActionType };
