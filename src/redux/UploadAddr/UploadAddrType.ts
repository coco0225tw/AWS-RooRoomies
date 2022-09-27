interface addressType {
  countyname: string;
  townname: string;
  completeAddr: string;
  floor: string;
  latLng: { lat: number | null; lng: number | null };
}

export default addressType;
