type usersType = (userInfoType | null)[];
interface userInfoType {
  userId: string;
  userPic: string;
  userName: string;
}

interface groupType {
  users: usersType;
  chatRoomId: string;
  isBooked: boolean;
}
type groupsType = groupType[];
export { groupsType, userInfoType };
