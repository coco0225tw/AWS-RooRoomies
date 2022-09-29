import { combineReducers } from "redux";
import UploadAddr from "./UploadAddr/UploadAddrReducer";
import UploadRoommatesCondition from "./UploadRoommatesCondition/UploadRoommatesConditionReducer";
import UploadFacility from "./UploadFacility/UploadFacilityReducer";
import UploadTitle from "./UploadTitle/UploadTitleReducer";
import UploadImages from "./UploadMainImageAndImages/UploadMainImageAndImagesReducer";
import UploadRooms from "./UploadRoomsDetails/UploadRoomsDetailsReducer";
import UploadTimes from "./UploadBookingTimes/UploadBookingTimesReducer";
import GetAuth from "./GetAuth/GetAuthReducer";
import SelectTab from "./SelectTab/SelectTabReducer";
import UploadMeAsRoommate from "./UserAsRoommate/UserAsRoommateReducer";
import Group from "./Group/GroupReducer";
import GetFavoriteLists from "./GetFavoriteListing/GetFavoriteListingReducer";
import GetCompareLists from "./GetCompareLists/GetCompareListsReducer";
import GetDndLists from "./GetDndLists/GetDndListsReducer";
import GetListingInHomePage from "./ListingDocumentForHomePage/ListingDocumentForHomePageReducer";
import GetLastDoc from "./LastDoc/LastDocReducer";
import AuthChange from "./OnAuthChange/OnAuthChangeReducer";
import PreviewImage from "./PreviewMainImage/PreviewMainImageReducer";
import PreviewOtherImages from "./PreviewOtherImages/PreviewOtherImagesReducer";
import Alert from "./Alert/AlertReducer";
import SubTab from "./SubTab/SubTabReducer";
const rootReducer = combineReducers({
  UploadAddrReducer: UploadAddr,
  UploadRoommatesConditionReducer: UploadRoommatesCondition,
  UploadFacilityReducer: UploadFacility,
  UploadTitleReducer: UploadTitle,
  UploadImagesReducer: UploadImages,
  UploadRoomsReducer: UploadRooms,
  UploadTimesReducer: UploadTimes,
  GetAuthReducer: GetAuth,
  SelectTabReducer: SelectTab,
  UserAsRoommateReducer: UploadMeAsRoommate,
  GroupReducer: Group,
  GetFavoriteListsReducer: GetFavoriteLists,
  GetCompareListsReducer: GetCompareLists,
  GetDndListsReducer: GetDndLists,
  GetListingInHomePageReducer: GetListingInHomePage,
  GetLastDocReducer: GetLastDoc,
  AuthChangeReducer: AuthChange,
  PreviewImageReducer: PreviewImage,
  PreviewOtherImagesReducer: PreviewOtherImages,
  AlertReducer: Alert,
  SubTabReducer: SubTab,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
