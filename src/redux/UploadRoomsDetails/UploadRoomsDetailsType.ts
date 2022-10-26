interface roomType {
  rent: number;
  sq: string;
  form: string;
  peopleAmount: number;
}

interface roomDetailsType extends Array<roomType> {}

export { roomDetailsType, roomType };
