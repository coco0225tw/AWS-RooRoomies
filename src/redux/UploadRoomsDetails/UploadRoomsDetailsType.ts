interface roomType {
  rent: number;
  sq: string;
  form: string;
  peopleAmount: number;
}

type roomDetailsType = roomType[];

export { roomDetailsType, roomType };
