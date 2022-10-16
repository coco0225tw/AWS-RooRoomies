import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';

import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormControl,
  LabelArea,
  ErrorText,
  FormCheckLabel,
  FormCheckInput,
  FormCheck,
  StyledForm,
} from '../../../components/InputArea';
import { RootState } from '../../../redux/rootReducer';

import { SubmitBtn, BtnArea, LastPageBtn } from '../../../components/Button';
import arrow from '../../../assets/arrow.png';
import addressType from '../../../redux/UploadAddr/UploadAddrType';
import { uploadAddrAction } from '../../../redux/UploadAddr/UploadAddrAction';

import countyItem from '../../../utils/county';
import allTowns from '../../../utils/town';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const StyledFormLabel = styled(FormLabel)`
  flex-shrink: 0;
`;
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
  display: ${(props) => (props.openDropDown ? 'flex' : 'none')};
  position: absolute;
  left: 12%;
  background-color: #ffffff;
  z-index: 2;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
  font-size: 20px;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;
  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
`;
const valid = {
  required: {
    value: true,
    message: '※必填欄位',
  },
  valueAsNumber: {
    value: true,
    message: '※請填寫數字',
  },
};

function ListingAddr({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();
  const getAddr = useSelector((state: RootState) => state.UploadAddrReducer);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm();

  const [openCountyDropDown, setOpenCountyDropDown] = useState<boolean>(false);
  const [openTownDropDown, setOpenTownDropDown] = useState<boolean>(false);
  interface County {
    countycode: number;
    countyname: string;
  }
  const [selectCounty, setSelectCounty] = useState<County>({
    countycode: getAddr.countycode,
    countyname: getAddr.countyname,
  });
  const [selectTown, setSelectTown] = useState<string>('');
  interface addressGroupType {
    label: string;
    key: string;
    required?: { value: boolean; message: string };
    valueAsNumber?: { value: boolean; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    countyOptions?: any;
    townOptions?: any;
    pattern?: { value: RegExp; message: string };
  }
  interface countyType {
    countycode: string;
    countyname: string;
    countycode01: number;
  }
  interface townType {
    towncode: number;
    towncode01: string;
    townname: string;
  }
  const addressFormGroups = [
    { label: '縣市', key: 'countyname', countyOptions: countyItem, required: valid.required },
    {
      label: '鄉鎮市區',
      key: 'townname',
      townOptions: [...allTowns[`townItem${selectCounty.countycode}` as keyof typeof allTowns]],
      required: valid.required,
    },
    {
      label: '完整住址 ',
      key: 'completeAddr',
      required: valid.required,
      maxLength: { value: 30, message: '※不可超過30字元' },
      pattern: {
        value: /^(\D+?[村里])?(\d+[鄰])?((\D+?(村路|[路街道段])?(\D?段)?))?(\d+巷)?(\d+弄)?(\d+號)+$/,
        message: '※例:精忠巷48號',
      },
    },
    {
      label: '樓',
      key: 'floor',
      required: valid.required,
      pattern: {
        value: /^\d*$/,
        message: '※請輸入數字',
      },
      min: {
        value: 1,
        message: '※至少1樓',
      },
      max: {
        value: 100,
        message: '※最多100樓',
      },
    },
    {
      label: '總樓層',
      key: 'totalFloor',
      required: valid.required,
      pattern: {
        value: /^\d*$/,
        message: '※請輸入數字',
      },
      min: {
        value: 1,
        message: '※至少1樓',
      },
      max: {
        value: 100,
        message: '※最多100樓',
      },
    },
  ];
  const onSubmit = (data) => {
    submit(data);

    setClickTab('上傳圖片');
  };
  async function submit(addrState: addressType) {
    const chineseAddr = `台灣${selectCounty.countyname}${addrState.townname}${addrState.completeAddr}`;
    const getGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${chineseAddr}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
    async function getGeocode() {
      await fetch(getGeocodeUrl).then((res) => {
        res.json().then((data) => {
          dispatch({
            type: uploadAddrAction.UPLOAD_ADDR,
            payload: {
              addrState: {
                ...addrState,
                latLng: data.results[0].geometry.location,
                countyname: selectCounty.countyname,
                countycode: selectCounty.countycode,
              },
            },
          });
        });
      });
    }
    await getGeocode();
  }
  useEffect(() => {
    for (const [key, value] of Object.entries(getAddr)) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [getAddr]);
  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {addressFormGroups.map((info: addressGroupType) => (
          <FormGroup key={info.key}>
            <LabelArea>
              <FormLabel>{info.label}</FormLabel>
              <ErrorText>{errors[info.key] && (errors[info.key].message as string)}</ErrorText>
            </LabelArea>
            <FormInputWrapper>
              {info.countyOptions ? (
                <React.Fragment>
                  <DropDown
                    onClick={() => (openCountyDropDown ? setOpenCountyDropDown(false) : setOpenCountyDropDown(true))}
                  >
                    {selectCounty.countyname
                      ? selectCounty.countyname
                      : getAddr.countyname !== ' '
                      ? getAddr.countyname
                      : '請選擇'}
                    <span>
                      <DropDownIcon openDropDown={openCountyDropDown} />
                    </span>
                  </DropDown>

                  <DropDownMenuWrapper
                    openDropDown={openCountyDropDown}
                    id={info.key}
                    aria-invalid={errors[info.key] ? 'true' : 'false'}
                  >
                    <Controller
                      control={control}
                      name={info.key}
                      rules={{
                        required: info.required && info.required,
                        maxLength: info.maxLength && info.maxLength,
                        pattern: info.pattern && info.pattern,
                      }}
                      render={({ field: { onChange, ...props } }) =>
                        info.countyOptions.map((o: countyType, oIndex: number) => (
                          <React.Fragment key={`${o.countycode01}${oIndex}`}>
                            <FormCheck style={{ padding: '8px 0px', width: 'auto' }}>
                              <CheckedFormCheckInput
                                type="radio"
                                id={`${o.countycode01}`}
                                key={`${o.countycode01}`}
                                name={info.key}
                                value-={o.countyname}
                                defaultChecked={getAddr.countyname === o.countyname}
                                onChange={(e) => {
                                  onChange(o.countyname);

                                  if (e.target.checked) {
                                    setOpenCountyDropDown(false);
                                    setSelectCounty({
                                      countycode: o.countycode01,
                                      countyname: o.countyname,
                                    });
                                    setOpenTownDropDown(false);
                                    setSelectTown('');
                                    dispatch({ type: uploadAddrAction.CLEAR_TOWN });
                                  }
                                }}
                              />
                              <CheckedFormCheckLabel htmlFor={`${o.countycode01}`}>
                                {o.countyname}
                              </CheckedFormCheckLabel>
                            </FormCheck>
                          </React.Fragment>
                        ))
                      }
                    />
                  </DropDownMenuWrapper>
                </React.Fragment>
              ) : info.townOptions ? (
                <React.Fragment>
                  <DropDown onClick={() => (openTownDropDown ? setOpenTownDropDown(false) : setOpenTownDropDown(true))}>
                    {selectTown !== '' ? selectTown : getAddr.townname !== '' ? getAddr.townname : '請選擇'}

                    <span>
                      <DropDownIcon openDropDown={openTownDropDown} />
                    </span>
                  </DropDown>

                  <DropDownMenuWrapper
                    openDropDown={openTownDropDown}
                    id={info.key}
                    aria-invalid={errors[info.key] ? 'true' : 'false'}
                  >
                    <Controller
                      control={control}
                      name={info.key}
                      rules={{
                        required: info.required && info.required,
                        maxLength: info.maxLength && info.maxLength,
                        pattern: info.pattern && info.pattern,
                      }}
                      render={({ field: { onChange, ...props } }) =>
                        info.townOptions.map((o: townType, oIndex: number) => (
                          <React.Fragment key={`${o.townname}${oIndex}`}>
                            <FormCheck style={{ padding: '8px 0px', width: 'auto' }}>
                              <CheckedFormCheckInput
                                type="radio"
                                id={`${o.townname}`}
                                key={`${o.townname}${oIndex}`}
                                name={info.key}
                                value-={o.townname}
                                defaultChecked={getAddr.townname === o.townname}
                                onChange={(e) => {
                                  onChange(o.townname);
                                  if (e.target.checked) {
                                    setOpenTownDropDown(false);
                                    setSelectTown(o.townname);
                                  }
                                }}
                              />
                              <CheckedFormCheckLabel htmlFor={`${o.townname}`}>{o.townname}</CheckedFormCheckLabel>
                            </FormCheck>
                          </React.Fragment>
                        ))
                      }
                    />
                  </DropDownMenuWrapper>
                </React.Fragment>
              ) : (
                <FormControl
                  id={info.key}
                  {...register(info.key, {
                    required: info.required && info.required,
                    maxLength: info.maxLength && info.maxLength,
                    min: info.min && info.min,
                    max: info.max && info.max,
                    pattern: info.pattern && info.pattern,
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
        <BtnArea>
          <LastPageBtn onClick={() => setClickTab('基本資訊')}>上一頁</LastPageBtn>
          <SubmitBtn type="submit" value="儲存" />
        </BtnArea>
      </StyledForm>
    </Wrapper>
  );
}

export default ListingAddr;
