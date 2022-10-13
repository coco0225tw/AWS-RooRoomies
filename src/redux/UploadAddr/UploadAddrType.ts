interface addressType {
  countyname: string;
  countycode: number;
  townname: string;
  completeAddr: string;
  floor: number | null;
  totalFloor: number | null;
  latLng: { lat: number | null; lng: number | null };
}

export default addressType;
