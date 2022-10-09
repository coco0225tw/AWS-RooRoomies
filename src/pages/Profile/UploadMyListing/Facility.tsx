import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheckLabel,
  FormCheck,
  ErrorText,
  LabelArea,
  StyledForm,
  FormControl,
} from '../../../components/InputArea';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';

import { RootState } from '../../../redux/rootReducer';
import { BtnDiv, SubmitBtn } from '../../../components/Button';

import Icons from '../../../assets/facility/Icon';
import facilityType from '../../../redux/UploadFacility/UploadFacilityType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
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
    color: #c77155;
  }
  &:checked + ${CheckedFormCheckLabel} span ${Icon} {
    border: solid 3px #c77155;
  }
`;
const valid = {
  required: {
    value: true,
    message: '※必填欄位',
  },
};
const facilityFormGroups = [
  {
    label: '押金(月)',
    key: 'deposit',
    required: valid.required,
    min: {
      value: 0,
      message: '※若不用請填0',
    },
    max: {
      value: 12,
      message: '※最多12個月',
    },
    pattern: {
      value: /^\d*(\.\d{0,1})?$/,
      message: '※請輸入數字，且小數點不可大於一位',
    },
  },
  {
    label: '額外費用',
    key: 'extraFee',
    options: [
      {
        label: 'administratorFee',
        text: '管理費',
        value: Icons.extraFee.administratorFee,
      },
      {
        label: 'cleanFee',
        text: '清潔費',
        value: Icons.extraFee.cleanFee,
      },
      {
        label: 'electricFee',
        text: '電費',
        value: Icons.extraFee.electricFee,
      },
      {
        label: 'waterFee',
        text: '水費',
        value: Icons.extraFee.waterFee,
      },
      {
        label: 'gasFee',
        text: '瓦斯費',
        value: Icons.extraFee.gasFee,
      },
      {
        label: 'wifiFee',
        text: '網路費',
        value: Icons.extraFee.wifiFee,
      },
    ],
  },
  {
    label: '設施',
    key: 'facility',
    options: [
      {
        label: 'fridge',
        text: '冰箱',
        value: Icons.facility.fridge,
      },
      {
        label: 'elevator',
        text: '電梯',
        value: Icons.facility.elevator,
      },

      {
        label: 'extinguisher',
        text: '滅火器',
        value: Icons.facility.extinguisher,
      },
      {
        label: 'natureGas',
        text: '天然氣',
        value: Icons.facility.natureGas,
      },

      {
        label: 'waterHeater',
        text: '熱水器',
        value: Icons.facility.waterHeater,
      },
      {
        label: 'kitchen',
        text: '廚房',
        value: Icons.facility.kitchen,
      },
      {
        label: 'washingMachine',
        text: '洗衣機',
        value: Icons.facility.washingMachine,
      },
      {
        label: 'wifi',
        text: '網路',
        value: Icons.facility.wifi,
      },
      {
        label: 'garbage',
        text: '代收垃圾',
        value: Icons.facility.garbage,
      },
      {
        label: 'fogDetector',
        text: '煙霧偵測器',
        value: Icons.facility.fogDetector,
      },
      {
        label: 'liquifiedGas',
        text: '桶裝瓦斯',
        value: Icons.facility.liquifiedGas,
      },
    ],
  },
  {
    label: '家俱',
    key: 'furniture',
    options: [
      {
        label: 'sofa',
        text: '沙發',
        value: Icons.furniture.sofa,
      },
      {
        label: 'airConditioner',
        text: '冷氣',
        value: Icons.furniture.airConditioner,
      },
      {
        label: 'wardrobe',
        text: '衣櫃',
        value: Icons.furniture.wardrobe,
      },
      {
        label: 'bed',
        text: '床',
        value: Icons.furniture.bed,
      },
      {
        label: 'bedding',
        text: '床俱',
        value: Icons.furniture.bedding,
      },
      {
        label: 'table',
        text: '桌子',
        value: Icons.furniture.table,
      },
      {
        label: 'chair',
        text: '椅子',
        value: Icons.furniture.chair,
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
        value: Icons.parking.motorbike,
      },
      {
        label: 'carParkingLot',
        text: '汽車停車位',
        value: Icons.parking.car,
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
        value: Icons.fire,
      },
    ],
  },
];

function Facility({ setClickTab, setDoc }: { setClickTab: React.Dispatch<React.SetStateAction<string>>; setDoc: any }) {
  const dispatch = useDispatch();
  const facilityInfo = useSelector((state: RootState) => state.UploadFacilityReducer);
  console.log(facilityInfo);
  const initialFacilityEmptyState = facilityInfo;
  const [facilityState, setFacilityState] = useState<facilityType>(initialFacilityEmptyState);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    submit(data);
  };
  async function submit(data) {
    dispatch({ type: 'UPLOAD_FACILITY', payload: { facilityState: data } });
  }
  async function submitHandler(data) {
    await submit(data);
    await setDoc(facilityState);
  }
  const handleChange = (e: any, field: any) => {
    const { checked, name } = e.target;
    if (checked) {
      setValue(field as any, [...getValues(field as any), name]);
    } else {
      setValue(
        field as any,
        getValues(field as any).filter((v) => v !== name)
      );
    }
  };
  useEffect(() => {
    let defaultValues = facilityInfo as any;

    reset({ ...defaultValues });
  }, [facilityInfo]);

  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {facilityFormGroups.map(({ label, key, options, required, min, max, pattern }) => (
          <FormGroup key={key}>
            <LabelArea>
              <FormLabel>{label}</FormLabel>
              <ErrorText>{errors[key] && (errors[key].message as string)}</ErrorText>
            </LabelArea>
            <FormInputWrapper style={{ display: 'flex' }}>
              {options ? (
                <Controller
                  control={control}
                  name={key as any}
                  defaultValue={[]}
                  render={({ field: { onChange, ...props } }) =>
                    (options as any).map((o, oIndex) => (
                      <FormCheck
                        key={o.value}
                        {...props}
                        style={{
                          flexBasis: '25%',
                          justifyContent: 'flex-start',
                          marginBottom: '12px',
                        }}
                      >
                        <CheckedFormCheckInput
                          type="checkbox"
                          id={o.label}
                          style={{ flexGrow: '0' }}
                          name={o.label}
                          value={key + o.value}
                          // checked={o.value}
                          defaultChecked={facilityInfo[key as keyof typeof facilityState].includes(o.label)}
                          onChange={(e) => {
                            handleChange(e, key);
                          }}
                        />
                        <CheckedFormCheckLabel htmlFor={o.label}>
                          {o.text}
                          <span style={{ marginLeft: '12px' }}>
                            <Icon img={o.value} />
                          </span>
                        </CheckedFormCheckLabel>
                      </FormCheck>
                    ))
                  }
                />
              ) : (
                <FormControl
                  {...register(key as any, {
                    required: required && required,
                    pattern: pattern && pattern,
                    min: min && min,
                    max: max && max,
                  })}
                  aria-invalid={errors[key] ? 'true' : 'false'}
                  defaultValue={facilityState[key as keyof typeof facilityState]}
                />
              )}
            </FormInputWrapper>
          </FormGroup>
        ))}
        <SubmitBtn type="submit" value="送出" />
      </StyledForm>
    </Wrapper>
  );
}

export default Facility;
