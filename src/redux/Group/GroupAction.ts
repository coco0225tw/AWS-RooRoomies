import { groupsType, userInfoType } from './GroupType';
import userType from '../GetAuth/GetAuthType';
enum groupAction {
  REMOVE_GROUP = 'REMOVE_GROUP',
  ADD_GROUP = 'ADD_GROUP',
  ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP',
  ADD_GROUP_FROM_FIREBASE = 'ADD_GROUP_FROM_FIREBASE',
}

interface removeGroup {
  type: groupAction.REMOVE_GROUP;
}
interface addGroup {
  type: groupAction.ADD_GROUP;
  payload: { newGroup: userInfoType };
}
interface addUserToGroup {
  type: groupAction.ADD_USER_TO_GROUP;
  payload: { groupId: number; userIndex: number; userInfo: userType };
}
interface getGroupFrmFirebase {
  type: groupAction.ADD_GROUP_FROM_FIREBASE;
  payload: { groups: groupsType };
}

type groupActionType = removeGroup | addGroup | addUserToGroup | getGroupFrmFirebase;

export { groupAction, groupActionType };
