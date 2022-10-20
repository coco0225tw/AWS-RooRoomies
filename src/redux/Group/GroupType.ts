interface userInfoType {
  userId: string;
  userPic: string;
  userName: string;
}
interface usersType extends Array<userInfoType | null> {}
interface groupType {
  users: usersType;
  chatRoomId: string;
  isBooked: boolean;
}
interface groupsType extends Array<groupType> {}
export { groupsType, userInfoType, usersType, groupType };
