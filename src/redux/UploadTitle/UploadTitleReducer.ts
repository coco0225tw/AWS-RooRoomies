import titleType from './UploadTitleType';
import { uploadTitleAction, uploadTitleActionType } from './UploadTitleAction';

const titleEmptyState: titleType = {
  title: '',
  totalSq: '',
  form: '',
  environmentDescription: '',
  phone: null,
  moveInDate: null,
};
export default function UploadTitle(state = titleEmptyState, action: uploadTitleActionType) {
  switch (action.type) {
    case uploadTitleAction.UPLOAD_TITLE:
      return action.payload.titleState;
    case uploadTitleAction.GET_LISTING_TITLE_FROM_FIREBASE:
      return action.payload.listingTitle;
    case uploadTitleAction.RETURN_INITIAL_TITLE:
      return titleEmptyState;
    default:
      return state;
  }
}
