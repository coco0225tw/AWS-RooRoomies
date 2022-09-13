interface userInfoType {
  userId: string;
  userPic: string;
  userName: string;
}
interface groupType {
  users: Array<userInfoType | null>;
  chatRoomId: string;
  isBooked: boolean;
}

export { groupType, userInfoType };
