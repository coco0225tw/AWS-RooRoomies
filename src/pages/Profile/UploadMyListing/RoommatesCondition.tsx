import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';

import { RootState } from '../../../redux/rootReducer';
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
} from '../../../components/InputArea';
import { SubmitBtn } from '../../../components/Button';
import roommatesConditionType from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 100%;
  height: 100%;
`;
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  // width: 100%;
  // display: none;
  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
`;
const valid = {
  required: {
    value: true,
    message: '※必填欄位',
  },
};
const roommatesConditionFormGroups = [
  {
    label: '性別',
    key: 'gender',
    required: valid.required,
    options: [
      {
        label: 'female',
        text: '限女',
        value: 'female',
      },
      {
        label: 'male',
        text: '限男',
        value: 'male',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '帶朋友過夜',
    key: 'bringFriendToStay',
    required: valid.required,
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '衛生習慣',
    key: 'hygiene',
    required: valid.required,
    options: [
      {
        label: 'good',
        text: '良好',
        value: 'good',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '生活習慣',
    key: 'livingHabit',
    required: valid.required,
    options: [
      {
        label: 'sleepEarly',
        text: '早睡',
        value: 'sleepEarly',
      },
      {
        label: 'nightCat',
        text: '夜貓子',
        value: 'nightCat',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '性別友善',
    key: 'genderFriendly',
    required: valid.required,
    options: [
      {
        label: 'true',
        text: '是',
        value: 'true',
      },
      {
        label: 'false',
        text: '不是',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '養寵物',
    key: 'pet',
    required: valid.required,
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '抽菸',
    key: 'smoke',
    required: valid.required,
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
];

function RoommatesCondition({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const roommatesConditionsInfo = useSelector((state: RootState) => state.UploadRoommatesConditionReducer);
  interface optionType {
    label: string;
    text: string;
    value: string;
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => {
    submit(data);
    setClickTab('設施');
  };
  function submit(roommatesState: roommatesConditionType) {
    dispatch({
      type: 'UPLOAD_ROOMMATESCONDITION',
      payload: { roommatesState },
    });
  }
  useEffect(() => {
    for (const [key, value] of Object.entries(roommatesConditionsInfo)) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [roommatesConditionsInfo]);
  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {roommatesConditionFormGroups.map(({ label, key, options, required }) => (
          <FormGroup key={key}>
            <LabelArea>
              <FormLabel>{label}</FormLabel>
              <ErrorText>{errors[key] && (errors[key].message as string)}</ErrorText>
            </LabelArea>
            <FormInputWrapper>
              <Controller
                control={control}
                name={key}
                rules={{
                  required: required && required,
                }}
                render={({ field: { onChange, ...props } }) =>
                  (options as any).map((o: optionType, oIndex: number) => (
                    <FormCheck key={`${key + o.value}}`} style={{ padding: '8px 0px' }}>
                      <CheckedFormCheckInput
                        type="radio"
                        id={`${key + o.value}`}
                        defaultChecked={roommatesConditionsInfo[key] === o.value}
                        {...props}
                        value={key + o.value}
                        onChange={(e) => {
                          onChange(o.label);
                          if (e.target.checked) {
                          }
                        }}
                      />
                      <CheckedFormCheckLabel htmlFor={`${key + o.value}`}>{o.text}</CheckedFormCheckLabel>
                    </FormCheck>
                  ))
                }
              />
            </FormInputWrapper>
          </FormGroup>
        ))}
        <SubmitBtn type="submit" value="儲存" />
      </StyledForm>
    </Wrapper>
  );
}

export default RoommatesCondition;
