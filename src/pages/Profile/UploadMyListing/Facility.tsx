import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import facilityType from '../../../redux/UploadFacility/UploadFacilityType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background-color: lightgrey;
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  //   width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const FormCheckInput = styled.input`
  margin: 0;
  flex-grow: 1;
  height: 19px;
`;

const FormCheck = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;

  & + & {
    margin-left: 30px;
  }

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 10px;

    & + & {
      margin-left: 27px;
    }
  }
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;

  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const FormControl = styled.input`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

const FormText = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #8b572a;
  margin-top: 10px;
  width: 100%;
  text-align: right;
`;
const facilityFormGroups = [
  { label: '押金', key: 'deposit' },
  {
    label: '額外費用',
    key: 'extraFee',
    options: [
      {
        label: 'cleanFee',
        text: '清潔費',
        value: 'cleanFee',
      },
      {
        label: 'electricFee',
        text: '電費',
        value: 'electricFee',
      },
      {
        label: 'waterFee',
        text: '水費',
        value: 'waterFee',
      },
      {
        label: 'gasFee',
        text: '瓦斯費',
        value: 'gasFee',
      },
      {
        label: 'wifiFee',
        text: '網路費',
        value: 'wifiFee',
      },
    ],
  },
  {
    label: '設施',
    key: 'facility',
    options: [
      {
        label: 'elevator',
        text: '電梯',
        value: 'elevator',
      },
      {
        label: 'fogDetector',
        text: '煙霧偵測器',
        value: 'fogDetector',
      },
      {
        label: 'extinguisher',
        text: '滅火器',
        value: 'extinguisher',
      },
      {
        label: 'natureGas',
        text: '天然氣',
        value: 'natureGas',
      },
      {
        label: 'liquifiedGas',
        text: '桶裝瓦斯',
        value: 'liquifiedGas',
      },
      {
        label: 'waterHeater',
        text: '熱水器',
        value: 'waterHeater',
      },
      {
        label: 'kitchen',
        text: '廚房',
        value: 'kitchen',
      },
      {
        label: 'washingMachine',
        text: '洗衣機',
        value: 'washingMachine',
      },
      {
        label: 'wifi',
        text: '網路',
        value: 'wifi',
      },
    ],
  },
  {
    label: '家俱',
    key: 'furniture',
    options: [
      {
        label: 'airConditioner',
        text: '冷氣',
        value: 'airConditioner',
      },
      {
        label: 'bed',
        text: '床',
        value: 'bed',
      },
      {
        label: 'bedding',
        text: '床俱',
        value: 'bedding',
      },
      {
        label: 'table',
        text: '桌子',
        value: 'table',
      },
      {
        label: 'chair',
        text: '椅子',
        value: 'chair',
      },
    ],
  },
  {
    label: '停車位',
    key: 'parking',
    options: [
      {
        label: 'scooterParkingLot',
        text: '機車停車位',
        value: 'scooterParkingLot',
      },
      {
        label: 'carParkingLot',
        text: '汽車停車位',
        value: 'carParkingLot',
      },
      {
        label: 'none',
        text: '無',
        value: 'none',
      },
    ],
  },
  {
    label: '規則',
    key: 'rules',
    options: [
      {
        label: 'fire',
        text: '可以開火',
        value: 'fire',
      },
    ],
  },
];

const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  &:hover {
    background-color: #222;
  }
`;

function Facility() {
  const dispatch = useDispatch();
  // interface facilityType {
  //   deposit: string;
  //   extraFee: string[];
  //   facility: string[];
  //   furniture: string[];
  //   parking: string[];
  //   rules: string[];
  // }
  const initialFacilityEmptyState = {
    deposit: '',
    extraFee: [],
    facility: [],
    furniture: [],
    parking: [],
    rules: [],
  };
  const [facilityState, setFacilityState] = useState<facilityType>(initialFacilityEmptyState);
  function submit() {
    dispatch({ type: 'UPLOAD_FACILITY', payload: { facilityState } });
    console.log('送出設施');
  }

  return (
    <Wrapper>
      <h1>設施</h1>
      {facilityFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          {options ? (
            options.map((option) => (
              <FormCheck key={option.value}>
                <FormCheckInput
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFacilityState({
                        ...facilityState,
                        [key]: [...facilityState[key as keyof typeof facilityState], option.value],
                      });
                    } else {
                      setFacilityState({
                        ...facilityState,
                        [key]: (facilityState[key as keyof typeof facilityState] as string[]).filter(
                          (el) => el !== option.value
                        ),
                      });
                    }
                  }}
                  type="checkbox"
                  name={label}
                />
                <FormCheckLabel>{option.text}</FormCheckLabel>
              </FormCheck>
            ))
          ) : (
            <FormControl
              onBlur={(e) => {
                setFacilityState({
                  ...facilityState,
                  [key]: e.target.value,
                });
              }}
            />
          )}
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit()}>送出</SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default Facility;
