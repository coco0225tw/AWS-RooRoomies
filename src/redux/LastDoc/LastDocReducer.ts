import lastDocType from "./LastDocType";
import { lastDocActionType, lastDocAction } from "./LastDocAction";

const emptyLastDoc: lastDocType = null;

export default function GetLastDoc(
  state = emptyLastDoc,
  action: lastDocActionType
) {
  switch (action.type) {
    case lastDocAction.GET_LAST_LISTING_DOC: {
      return action.payload.lastDocData;
    }
    default:
      return state;
  }
}
