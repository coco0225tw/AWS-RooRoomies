import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';

import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheckLabel,
  FormControl,
  FormCheck,
  ErrorText,
  LabelArea,
  StyledForm,
} from '../../../components/InputArea';
import Calendar from 'react-calendar';

import CalendarContainer from '../../../components/Calendar';
import { RootState } from '../../../redux/rootReducer';
import { SubmitBtn } from '../../../components/Button';
import arrow from '../../../assets/arrow.png';
import titleType from '../../../redux/UploadTitle/UploadTitleType';
import { uploadTitleAction } from '../../../redux/UploadTitle/UploadTitleAction';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  // width: 100%;
  display: none;
  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 20vh;
  border-radius: 12px;
  padding: 8px;
  letter-spacing: 1.6px;
  font-size: 20px;
  color: #4f5152;
  margin-top: 12px;
  &:focus {
    outline: #4f5152;
  }
`;
const StyledFormLabel = styled(FormLabel)`
  flex-shrink: 0;
`;
const StyledFormControl = styled(FormControl)``;
const DropDown = styled(StyledFormLabel)`
  cursor: pointer;
  color: #c77155;
  border-color: #c77155;

  display: flex;
  align-items: flex-start;
`;
const DropDownIcon = styled.div<{ openDropDown: boolean }>`
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  background-image: url(${arrow});
  background-position: center;
  transform: ${(props) => (props.openDropDown ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition-duration: 0.2s;
  border: solid 1px #fff7f4;
  margin-left: 12px;
`;
const DropDownMenuWrapper = styled.div<{ openDropDown: boolean }>`
  display: ${(props) => (props.openDropDown ? 'block' : 'none')};
  position: absolute;
  left: 10%;
  background-color: #ffffff;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

function ListingTitle({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const titleInfo = useSelector((state: RootState) => state.UploadTitleReducer);

  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<string>('請選擇');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => {
    submit(data);
    setClickTab('地址');
  };

  const valid = {
    required: {
      value: true,
      message: '※必填欄位',
    },
  };

  const hookFormGroup = [
    {
      label: '名稱',
      key: 'title',
      required: valid.required,
      minLength: {
        value: 2,
        message: '※至少2個字元',
      },
      maxLength: {
        value: 20,
        message: '※不可超過20個字元',
      },
    },
    {
      label: '總坪數',
      key: 'totalSq',
      required: valid.required,
      min: {
        value: 1,
        message: '※至少1坪',
      },
      max: {
        value: 100,
        message: '※最多100坪',
      },
      pattern: {
        value: /^\d*(\.\d{0,2})?$/,
        message: '※請輸入數字，且小數點不可大於兩位',
      },
    },
    {
      label: '規格',
      key: 'form',
      required: valid.required,
      options: [
        { label: '公寓', key: 'apartment' },
        { label: '電梯大樓', key: 'flat' },
      ],
    },
    {
      label: '描述(最多100字)',
      key: 'environmentDescription',
      maxLength: {
        value: 100,
        message: '※不可超過100個字元',
      },
    },
    {
      label: '連絡電話(手機)',
      key: 'phone',
      required: valid.required,
      pattern: {
        value: /^09[0-9]{8}$/,
        message: '※請輸入正確的手機號碼',
      },
    },
    {
      label: '入住時間(半年內) ',
      key: 'moveInDate',
      required: valid.required,
    },
  ];
  const [selectedDate, setSelectedDate] = useState<Date>(titleInfo.moveInDate && titleInfo.moveInDate);
  interface tileDisabledType {
    date: Date;
  }
  const tileDisabled = ({ date }: tileDisabledType) => {
    return (
      date > new Date(new Date().getFullYear(), new Date().getMonth() - 1 + 6, new Date().getDate()) ||
      date < new Date()
    );
  };

  function clickDate(date: Date) {
    setSelectedDate(date);
  }
  function submit(titleState: titleType) {
    dispatch({ type: uploadTitleAction.UPLOAD_TITLE, payload: { titleState } });
  }
  useEffect(() => {
    for (const [key, value] of Object.entries(titleInfo)) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [titleInfo]);
  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {hookFormGroup.map((info) => (
          <FormGroup key={info.key}>
            <LabelArea>
              <FormLabel htmlFor={info.key}>{info.label}</FormLabel>
              <ErrorText>{errors[info.key] && (errors[info.key].message as string)}</ErrorText>
              {info.key === 'moveInDate' && selectedDate && (
                <span style={{ color: '#c77155' }}>
                  {selectedDate.getFullYear() +
                    '-' +
                    ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + selectedDate.getDate()).slice(-2)}
                </span>
              )}
            </LabelArea>
            <FormInputWrapper>
              {info.options ? (
                <React.Fragment>
                  <DropDown onClick={() => (openDropDown ? setOpenDropDown(false) : setOpenDropDown(true))}>
                    {titleInfo.form !== '' ? titleInfo.form : selectedForm}
                    <span>
                      <DropDownIcon openDropDown={openDropDown} />
                    </span>
                  </DropDown>

                  <DropDownMenuWrapper
                    openDropDown={openDropDown}
                    id={info.key}
                    aria-invalid={errors[info.key] ? 'true' : 'false'}
                  >
                    <Controller
                      control={control}
                      name={info.key}
                      rules={{
                        required: info.required,
                        pattern: info.pattern,
                        minLength: info.minLength,
                        maxLength: info.maxLength,
                      }}
                      render={({ field: { onChange, ...props } }) => (
                        <React.Fragment>
                          {info.options.map((o, oIndex) => (
                            <React.Fragment key={`${o.key}${oIndex}`}>
                              <FormCheck style={{ padding: '8px 0px' }}>
                                <CheckedFormCheckInput
                                  type="radio"
                                  id={`${o.key}`}
                                  key={`${o.key}${oIndex}`}
                                  defaultChecked={titleInfo.form === o.label}
                                  name={o.label}
                                  value-={o.label}
                                  onChange={(e) => {
                                    onChange(o.label);
                                    if (e.target.checked) {
                                      setSelectedForm(o.label);
                                      setOpenDropDown(false);
                                    }
                                  }}
                                />
                                <CheckedFormCheckLabel htmlFor={`${o.key}`}>{o.label}</CheckedFormCheckLabel>
                              </FormCheck>
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      )}
                    />
                  </DropDownMenuWrapper>
                </React.Fragment>
              ) : info.key === 'moveInDate' ? (
                <Controller
                  control={control}
                  name={info.key}
                  rules={{
                    required: info.required && info.required,
                    pattern: info.pattern && info.pattern,
                  }}
                  render={({ field }) => (
                    <CalendarContainer style={{ marginLeft: '0' }}>
                      <Calendar
                        {...field}
                        minDetail="month"
                        view="month"
                        defaultValue={titleInfo.moveInDate}
                        onClickDay={clickDate}
                        selectRange={false}
                        tileDisabled={tileDisabled}
                      />
                    </CalendarContainer>
                  )}
                />
              ) : info.key === 'environmentDescription' ? (
                <TextArea
                  id={info.key}
                  {...register(info.key, {
                    required: info.required,
                    pattern: info.pattern,
                    minLength: info.minLength,
                    maxLength: info.maxLength,
                  })}
                  aria-invalid={errors[info.key] ? 'true' : 'false'}
                />
              ) : (
                <StyledFormControl
                  id={info.key}
                  {...register(info.key, {
                    required: info.required,
                    pattern: info.pattern,
                    minLength: info.minLength,
                    maxLength: info.maxLength,
                    min: info.min,
                    max: info.max,
                  })}
                  onKeyDown={(e) => {
                    if (e.key == ' ') {
                      e.preventDefault();
                    }
                  }}
                  aria-invalid={errors[info.key] ? 'true' : 'false'}
                />
              )}
            </FormInputWrapper>
          </FormGroup>
        ))}

        <SubmitBtn type="submit" value="儲存" />
      </StyledForm>
    </Wrapper>
  );
}

export default ListingTitle;
