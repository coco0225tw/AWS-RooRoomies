import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

import { RootState } from '../../../redux/rootReducer';
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
import { BtnDiv, SubmitBtn } from '../../../components/Button';
import bin from '../../../assets/bin.png';
import { roomDetailsType, roomType } from '../../../redux/UploadRoomsDetails/UploadRoomsDetailsType';
import arrow from '../../../assets/arrow.png';
import AboutMe from '../AboutMe/AboutMe';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Table = styled.table`
  width: 100%;
  font-size: 16px;
`;

const Td = styled.td`
  text-align: center;
  padding: 8px 4px;
`;

const Cross = styled.div`
  background-image: url(${bin});
  background-size: 20px 20px;
  width: 100%;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
const StyledFormGroup = styled(StyledForm)``;

const FormGroupStyled = styled(FormGroup)`
  width: 50%;
  padding-right: 12px;
`;
const StyledSubmitBtn = styled(SubmitBtn)`
  margin-top: 12px;
  margin-bottom: 12px;
  align-self: flex-end;
`;
const Tr = styled.tr``;
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
  top: 100%;
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
};
const StyledBtnDiv = styled(BtnDiv)`
  align-self: flex-end;
`;

type optionType = { label: string; key: string }[];
const rentRoomDetailsFormGroups = [
  {
    label: '月租',
    key: 'rent',
    required: valid.required,
    min: {
      value: 1,
      message: '※至少1元',
    },
    max: {
      value: 1000000,
      message: '※最多100萬',
    },
    pattern: {
      value: /^\d*$/,
      message: '※請輸入數字，且不可有小數點',
    },
  },
  {
    label: '大小(坪)',
    key: 'sq',
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
      { label: '雅房', key: 'bedsit' },
      { label: '套房', key: 'suite' },
    ],
  },
  {
    label: '人數',
    key: 'peopleAmount',
    required: valid.required,
    min: {
      value: 1,
      message: '※至少1人',
    },
    pattern: {
      value: /^\d*$/,
      message: '※請輸入數字，且不可有小數點',
    },
    max: {
      value: 20,
      message: '※最多20人',
    },
  },
];
function RentRoomDetails({ setClickTab }: { setClickTab: React.Dispatch<React.SetStateAction<string>> }) {
  const dispatch = useDispatch();

  const roomInfo = useSelector((state: RootState) => state.UploadRoomsReducer);
  const [roomState, setRoomState] = useState<roomDetailsType>(roomInfo);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [selectOptions, setSelectOptions] = useState<string | null>(null);
  interface optionType {
    label: string;
    key: string;
  }
  const roomRef = useRef<HTMLInputElement[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data: roomType) => {
    addRooms(data);
    reset();
    setSelectOptions(null);
  };
  function addRooms(data: roomType) {
    setRoomState([...roomState, data]);
  }
  function submit() {
    dispatch({ type: 'UPLOAD_ROOMS', payload: { roomState: roomState } });
  }
  function deleteRoom(index: number) {
    setRoomState(roomState.filter((el, i) => i !== index));
  }
  return (
    <Wrapper>
      <StyledFormGroup onSubmit={handleSubmit(onSubmit)}>
        <InputArea>
          {rentRoomDetailsFormGroups.map((r, index) => (
            <FormGroupStyled key={r.key}>
              <LabelArea>
                <FormLabel>{r.label}</FormLabel>
                <ErrorText>{errors[r.key] && (errors[r.key].message as string)}</ErrorText>
              </LabelArea>
              <FormInputWrapper>
                {(r.options as any) ? (
                  <React.Fragment>
                    <DropDown onClick={() => setOpenDropDown(!openDropDown)}>
                      {selectOptions ? selectOptions : '請選擇'}
                      <span>
                        <DropDownIcon openDropDown={openDropDown} />
                      </span>
                    </DropDown>

                    <DropDownMenuWrapper
                      openDropDown={openDropDown}
                      id={r.key}
                      aria-invalid={errors[r.key] ? 'true' : 'false'}
                    >
                      <Controller
                        control={control}
                        name={r.key}
                        rules={{
                          required: r.required && r.required,
                          pattern: r.pattern && r.pattern,
                        }}
                        render={({ field: { onChange, ...props } }) =>
                          (r.options as any).map((o: optionType, oIndex: number) => (
                            <React.Fragment key={`${o.key}${oIndex}`}>
                              <FormCheck style={{ padding: '8px 0px', width: 'auto' }}>
                                <CheckedFormCheckInput
                                  type="radio"
                                  id={`${o.key}`}
                                  key={`${o.key}${oIndex}`}
                                  name={r.key}
                                  value-={o.key}
                                  onChange={(e) => {
                                    onChange(o.label);
                                    if (e.target.checked) {
                                      setSelectOptions(o.label);
                                      setOpenDropDown(!openDropDown);
                                    }
                                  }}
                                />
                                <CheckedFormCheckLabel htmlFor={`${o.key}`}>{o.label}</CheckedFormCheckLabel>
                              </FormCheck>
                            </React.Fragment>
                          ))
                        }
                      />
                    </DropDownMenuWrapper>
                  </React.Fragment>
                ) : (
                  <FormControl
                    type="input"
                    {...register(r.key, {
                      required: r.required && r.required,
                      pattern: r.pattern && r.pattern,
                      min: r.min && r.min,
                      max: r.max && r.max,
                    })}
                  />
                )}
              </FormInputWrapper>
            </FormGroupStyled>
          ))}
        </InputArea>
        <StyledSubmitBtn value="加入房間" type="submit" />
      </StyledFormGroup>
      {roomState.length !== 0 && (
        <Table style={{ border: 'solid 1px #ece2d5', marginBottom: '12px' }}>
          <Tr style={{ borderBottom: ' solid 1px #ece2d5 ' }}>
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }} />
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>價錢</Td>
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>坪數</Td>
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>規格</Td>
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>入住人數</Td>
            <Td style={{ borderBottom: ' solid 1px #ece2d5 ' }}>刪除</Td>
          </Tr>
          {roomState.map((r: roomType, index: number) => (
            <Tr key={`room${index}`}>
              <Td>房間{index + 1}</Td>
              <Td>{r.rent}元</Td>
              <Td>{r.sq}坪</Td>
              <Td>{r.form}</Td>
              <Td>{r.peopleAmount}人</Td>
              <Td>
                <Cross onClick={() => deleteRoom(index)} />
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <StyledBtnDiv
        onClick={() => {
          submit();
          setClickTab('設定看房時間');
        }}
      >
        儲存
      </StyledBtnDiv>
    </Wrapper>
  );
}

export default RentRoomDetails;
