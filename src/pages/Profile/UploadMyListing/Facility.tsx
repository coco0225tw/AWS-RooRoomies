import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import facilityType from '../../../redux/UploadFacility/UploadFacilityType';
import { SubTitle } from '../../../components/ProfileTitle';
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../../components/InputArea';
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
      <SubTitle>設施</SubTitle>
      {facilityFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            {options ? (
              options.map((option) => (
                <FormCheck key={option.value}>
                  <CustomFormCheckInput
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
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit()}>送出</SubmitBtn>
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default Facility;
