import { groupsType, userInfoType } from "./GroupType";
import { groupAction, groupActionType } from "./GroupAction";

const groupInitialState: groupsType = [];

export default function Group(
  state = groupInitialState,
  action: groupActionType
) {
  switch (action.type) {
    case groupAction.REMOVE_GROUP: {
      const newGroup = [...state];
      return newGroup.filter((g, id) => !g.users.every((u) => u === null));
    }
    case groupAction.ADD_GROUP: {
      return [...state, action.payload.newGroup];
    }
    case groupAction.ADD_USER_TO_GROUP: {
      const newGroup = [...state];
      newGroup[action.payload.groupId].users[action.payload.userIndex] = {
        userId: action.payload.userInfo.uid,
        userPic: action.payload.userInfo.image,
        userName: action.payload.userInfo.name,
      };
      return newGroup;
    }
    case groupAction.ADD_GROUP_FROM_FIREBASE: {
      return [...action.payload.groups];
    }
    default:
      return state;
  }
}
