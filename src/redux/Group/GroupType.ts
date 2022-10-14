interface userInfoType {
  userId: string;
  userPic: string;
  userName: string;
}
type usersType = (userInfoType | null)[];
interface groupType {
  users: usersType;
  chatRoomId: string;
  isBooked: boolean;
}
type groupsType = groupType[];
export { groupsType, userInfoType, usersType, groupType };
