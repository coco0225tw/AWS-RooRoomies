type Action =
  | { type: "PREVIEW_OTHERIMAGES"; payload: { otherImages: string[] } }
  | { type: "RETURN_INITIAL_OTHER_IMAGES" };
const otherImagesInitialState: string[] = [];

export default function previewOtherImages(
  state = otherImagesInitialState,
  action: Action
) {
  switch (action.type) {
    case "PREVIEW_OTHERIMAGES":
      return action.payload.otherImages;
    case "RETURN_INITIAL_OTHER_IMAGES":
      return otherImagesInitialState;
    default:
      return state;
  }
}
