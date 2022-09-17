import titleType from './UploadTitleType';
type Action = { type: 'UPLOAD_TITLE'; payload: { titleState: titleType } } | { type: 'RETURN_INITIAL_TITLE' };

const titleEmptyState = {
  title: '',
  totalSq: '',
  form: '',
};
export default function UploadTitle(state = titleEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_TITLE':
      return action.payload.titleState;
    case 'RETURN_INITIAL_TITLE':
      return titleEmptyState;
    default:
      return state;
  }
}
