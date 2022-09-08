import titleType from './UploadTitleType';
type Action = { type: 'UPLOAD_TITLE'; payload: { titleState: titleType } };

const titleEmptyState = {
  title: '',
  totalSq: '',
  form: '',
};
export default function UploadTitle(state = titleEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_TITLE':
      return action.payload.titleState;
    default:
      return state;
  }
}
