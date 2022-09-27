import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import facilityType from "../../../redux/UploadFacility/UploadFacilityType";
import { SubTitle } from "../../../components/ProfileTitle";
import { RootState } from "../../../redux/rootReducer";
import { BtnDiv, BtnLink } from "../../../components/Button";
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../../components/InputArea";

import Icons from "../../../assets/facility/Icon";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  // background-color: lightgrey;
`;

const FormText = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #8b572a;
  margin-top: 10px;
  width: 100%;
  text-align: right;
`;

const CustomFormCheckInput = styled(FormCheckInput)`
  margin-left: 0px;
`;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const Icon = styled.div<{ img: string }>`
  height: 40px;
  width: 40px;
  background-size: 36px 36px;
  background-image: url(${(props) => props.img});
  border-radius: 50%;
  background-position: center center;
  padding: 4px;
`;

const Input = styled(CustomFormCheckInput)`
  &:checked + ${FormCheckLabel} {
    color: blue;
  }
`;
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
  display: flex;
  margin-left: 0px;

  align-items: center;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;

  &:checked + ${CheckedFormCheckLabel} {
    // background: #c77155;
    color: #c77155;
  }
  &:checked + ${CheckedFormCheckLabel} span ${Icon} {
    // background-color: #c77155;
    border: solid 3px #c77155;
  }
`;
const facilityFormGroups = [
  { label: "押金(月)", key: "deposit" },
  {
    label: "額外費用",
    key: "extraFee",
    options: [
      {
        label: "administratorFee",
        text: "管理費",
        value: Icons.extraFee.administratorFee,
      },
      {
        label: "cleanFee",
        text: "清潔費",
        value: Icons.extraFee.cleanFee,
      },
      {
        label: "electricFee",
        text: "電費",
        value: Icons.extraFee.electricFee,
      },
      {
        label: "waterFee",
        text: "水費",
        value: Icons.extraFee.waterFee,
      },
      {
        label: "gasFee",
        text: "瓦斯費",
        value: Icons.extraFee.gasFee,
      },
      {
        label: "wifiFee",
        text: "網路費",
        value: Icons.extraFee.wifiFee,
      },
    ],
  },
  {
    label: "設施",
    key: "facility",
    options: [
      {
        label: "fridge",
        text: "冰箱",
        value: Icons.facility.fridge,
      },
      {
        label: "elevator",
        text: "電梯",
        value: Icons.facility.elevator,
      },

      {
        label: "extinguisher",
        text: "滅火器",
        value: Icons.facility.extinguisher,
      },
      {
        label: "natureGas",
        text: "天然氣",
        value: Icons.facility.natureGas,
      },

      {
        label: "waterHeater",
        text: "熱水器",
        value: Icons.facility.waterHeater,
      },
      {
        label: "kitchen",
        text: "廚房",
        value: Icons.facility.kitchen,
      },
      {
        label: "washingMachine",
        text: "洗衣機",
        value: Icons.facility.washingMachine,
      },
      {
        label: "wifi",
        text: "網路",
        value: Icons.facility.wifi,
      },
      {
        label: "garbage",
        text: "代收垃圾",
        value: Icons.facility.garbage,
      },
      {
        label: "fogDetector",
        text: "煙霧偵測器",
        value: Icons.facility.fogDetector,
      },
      {
        label: "liquifiedGas",
        text: "桶裝瓦斯",
        value: Icons.facility.liquifiedGas,
      },
    ],
  },
  {
    label: "家俱",
    key: "furniture",
    options: [
      {
        label: "sofa",
        text: "沙發",
        value: Icons.furniture.sofa,
      },
      {
        label: "airConditioner",
        text: "冷氣",
        value: Icons.furniture.airConditioner,
      },
      {
        label: "wardrobe",
        text: "衣櫃",
        value: Icons.furniture.wardrobe,
      },
      {
        label: "bed",
        text: "床",
        value: Icons.furniture.bed,
      },
      {
        label: "bedding",
        text: "床俱",
        value: Icons.furniture.bedding,
      },
      {
        label: "table",
        text: "桌子",
        value: Icons.furniture.table,
      },
      {
        label: "chair",
        text: "椅子",
        value: Icons.furniture.chair,
      },
    ],
  },
  {
    label: "停車位",
    key: "parking",
    options: [
      {
        label: "scooterParkingLot",
        text: "機車停車位",
        value: Icons.parking.motorbike,
      },
      {
        label: "carParkingLot",
        text: "汽車停車位",
        value: Icons.parking.car,
      },
      {
        label: "none",
        text: "無",
        value: "none",
      },
    ],
  },
  {
    label: "規則",
    key: "rules",
    options: [
      {
        label: "fire",
        text: "可以開火",
        value: Icons.fire,
      },
    ],
  },
];

function Facility({
  setClickTab,
  setDoc,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
  setDoc: any;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const facilityInfo = useSelector(
    (state: RootState) => state.UploadFacilityReducer
  );
  console.log(facilityInfo);
  const initialFacilityEmptyState =
    // userInfo!.userListingId?.length !== 0
    //   ?
    facilityInfo;
  // : {
  //     deposit: "",
  //     extraFee: [],
  //     facility: [],
  //     furniture: [],
  //     parking: [],
  //     rules: [],
  //   };
  const [facilityState, setFacilityState] = useState<facilityType>(
    initialFacilityEmptyState
  );
  async function submit() {
    dispatch({ type: "UPLOAD_FACILITY", payload: { facilityState } });
    console.log("送出設施");
  }
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <Wrapper>
      {/* <SubTitle>設施</SubTitle> */}
      {facilityFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper style={{ display: "flex" }}>
            {options ? (
              options.map((option) => (
                <FormCheck
                  key={option.value}
                  style={{
                    flexBasis: "25%",
                    // marginRight: "12px",
                    justifyContent: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  {facilityState &&
                  facilityState[key as keyof facilityType].includes(
                    option.label
                  ) ? (
                    <CheckedFormCheckInput
                      id={option.label}
                      style={{ flexGrow: "0" }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFacilityState({
                            ...facilityState,
                            [key]: [
                              ...facilityState[
                                key as keyof typeof facilityState
                              ],
                              option.value,
                            ],
                          });
                        } else {
                          setFacilityState({
                            ...facilityState,
                            [key]: (
                              facilityState[
                                key as keyof typeof facilityState
                              ] as string[]
                            ).filter((el) => el !== option.value),
                          });
                        }
                      }}
                      type="checkbox"
                      name={option.label}
                      // value={facilityState[key as keyof facilityType]}
                      defaultChecked
                    />
                  ) : (
                    <CheckedFormCheckInput
                      id={option.label}
                      style={{ flexGrow: "0" }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFacilityState({
                            ...facilityState,
                            [key]: [
                              ...facilityState[
                                key as keyof typeof facilityState
                              ],
                              option.label,
                            ],
                          });
                        } else {
                          setFacilityState({
                            ...facilityState,
                            [key]: (
                              facilityState[
                                key as keyof typeof facilityState
                              ] as string[]
                            ).filter((el) => el !== option.value),
                          });
                        }
                      }}
                      type="checkbox"
                      name={option.label}
                    />
                  )}

                  <CheckedFormCheckLabel htmlFor={option.label}>
                    {option.text}
                    <span style={{ marginLeft: "12px" }}>
                      <Icon img={option.value} />
                    </span>
                  </CheckedFormCheckLabel>
                </FormCheck>
              ))
            ) : (
              <FormControl
                defaultValue={facilityState[key as keyof typeof facilityState]}
                onBlur={(e) => {
                  setFacilityState({
                    ...facilityState,
                    [key]: e.target.value,
                  });
                }}
              />
            )}
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn
        onClick={async () => {
          await submit();
          await setDoc(facilityState);
        }}
      >
        送出
      </SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default Facility;
