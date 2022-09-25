import titleType from "./UploadTitleType";
type Action =
  | { type: "UPLOAD_TITLE"; payload: { titleState: titleType } }
  | {
      type: "GET_LISTING_TITLE_FROM_FIREBASE";
      payload: { listingTitle: titleType };
    }
  | { type: "RETURN_INITIAL_TITLE" };

const titleEmptyState = {
  title: "",
  totalSq: "",
  form: "",
  environmentDescription: "",
};
export default function UploadTitle(state = titleEmptyState, action: Action) {
  switch (action.type) {
    case "UPLOAD_TITLE":
      return action.payload.titleState;
    case "GET_LISTING_TITLE_FROM_FIREBASE":
      console.log(action.payload);
      return action.payload.listingTitle;
    case "RETURN_INITIAL_TITLE":
      return titleEmptyState;
    default:
      return state;
  }
}
