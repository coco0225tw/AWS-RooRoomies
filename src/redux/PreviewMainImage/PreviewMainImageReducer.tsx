type Action =
  | { type: "PREVIEW_MAINIMAGE"; payload: { mainImage: string } }
  | { type: "RETURN_INITIAL_IMAGE" };
const mainImageInitialState = "";

export default function previewMainImage(
  state = mainImageInitialState,
  action: Action
) {
  switch (action.type) {
    case "PREVIEW_MAINIMAGE":
      return action.payload.mainImage;
    case "RETURN_INITIAL_IMAGE":
      return mainImageInitialState;
    default:
      return state;
  }
}
