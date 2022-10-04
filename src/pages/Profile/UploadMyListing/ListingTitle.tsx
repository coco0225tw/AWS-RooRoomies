import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import titleType from "../../../redux/UploadTitle/UploadTitleType";
import { SubTitle } from "../../../components/ProfileTitle";
import { RootState } from "../../../redux/rootReducer";
import { BtnDiv, BtnLink, InputBtn } from "../../../components/Button";
import arrow from "../../../assets/arrow.png";
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
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  // background-color: lightgrey;
`;

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
const TextArea = styled.textarea`
  height: 20vh;
  width: 100%;
  letter-spacing: 1.6px;
  font-size: 20px;
  border-radius: 8px;
  border: solid 1px #979797;
  padding: 8px;
  margin-top: 12px;
`;
const AlertText = styled.div`
  color: #c77155;
  position: absolute;
  right: 0;
  top: 100%;
`;
const StyledFormControl = styled(FormControl)`
  // &:focus {
  //   outline: #c77155;
  // }
`;
const StyledFormInputWrapper = styled(FormInputWrapper)`
  margin-left: 40px;
  margin-top: 0px;
`;
const DropDownMenuWrapper = styled(StyledFormInputWrapper)`
  margin-left: 0px;
  position: absolute;
  background-color: #fff;
  z-index: 1;
  top: 48px;
  box-shadow: 0px 0px 3px #bbbbbb;
  // align-items: flex-start;
  width: 60%;
  flex-direction: column;
  padding: 8px inherit;
`;
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;
  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
`;
const StyledFormLabel = styled(FormLabel)`
  flex-shrink: 0;
`;
const DropDown = styled(StyledFormLabel)`
  cursor: pointer;
  // color: #c77155;
  border-color: #c77155;
  font-size: 20px;
  display: flex;
  align-items: center;
`;
const DropDownIcon = styled.div<{ openDropDown: boolean }>`
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  background-image: url(${arrow});
  background-position: center;
  transform: ${(props) =>
    props.openDropDown ? "rotate(180deg)" : "rotate(0deg)"};
  transition-duration: 0.2s;
  margin-left: 20px;
  border: solid 1px #fff7f4;
`;

function ListingTitle({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const titleInfo = useSelector((state: RootState) => state.UploadTitleReducer);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<string>("請選擇");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => {
    submit(data);
    setClickTab("地址");
  };
  const initialTitleState =
    // userInfo!.userListingId?.length !== 0
    //   ?
    titleInfo;

  // : {
  //     title: "",
  //     totalSq: "",
  //     form: "",
  //     environmentDescription: "",
  //   };

  const titleFormGroups = [
    { label: "名稱", key: "title" },
    { label: "坪數", key: "totalSq" },
    { label: "規格 ", key: "form" },
    { label: "描述 ", key: "environmentDescription" },
    { label: "連絡電話 ", key: "phone" },
    { label: "入住時間 ", key: "moveInDate" },
  ];
  const hookFormGroup = [
    {
      label: "名稱",
      key: "title",
      required: {
        value: true,
        message: "※必填欄位",
      },
      pattern: null,
      // maxLength: {
      //   value: 5,
      //   message: "※請輸入至少五個字",
      // },
    },
    {
      label: "總坪數",
      key: "totalSq",
      required: {
        value: true,
        message: "※必填欄位",
      },
      pattern: {
        value: /^([1-9]([0-9]*))$/,
        message: "※請輸入正確的坪數",
      },
      // maxLength: null,
    },
    {
      label: "規格",
      key: "form",
      required: {
        value: true,
        message: "※必填欄位",
      },
      // maxLength: null,
      pattern: null,
      options: [
        { label: "公寓", key: "apartment" },
        { label: "電梯大樓", key: "flat" },
      ],
    },
    {
      label: "描述",
      key: "environmentDescription",
      // maxLength: null,
      required: null,
      pattern: null,
    },
    {
      label: "連絡電話(手機)",
      key: "phone",
      required: {
        value: true,
        message: "※必填欄位",
      },
      // maxLength: null,
      pattern: {
        value: /^09[0-9]{8}$/,
        message: "※請輸入正確的手機號碼",
      },
    },
    {
      label: "入住時間 ",
      key: "moveInDate",
      // maxLength: null,
      required: {
        value: true,
        message: "※必填欄位",
      },
      pattern: null,
    },
  ];
  const [titleState, setTitleState] = useState<titleType>(initialTitleState);
  function submit(titleState: titleType) {
    dispatch({ type: "UPLOAD_TITLE", payload: { titleState } });
  }
  useEffect(() => {
    // const object = localStorage.getItem("object");
    for (const [key, value] of Object.entries(titleInfo)) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [titleInfo]);
  return (
    <Wrapper>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        {hookFormGroup.map(({ label, key, required, pattern, options }) => (
          <FormGroup key={key}>
            <FormLabel htmlFor={key}>{label}</FormLabel>
            <FormInputWrapper>
              {options ? (
                <React.Fragment>
                  <DropDown
                    onClick={() =>
                      openDropDown
                        ? setOpenDropDown(false)
                        : setOpenDropDown(true)
                    }
                  >
                    {selectedForm}
                    <span>
                      <DropDownIcon openDropDown={openDropDown} />
                    </span>
                  </DropDown>

                  {openDropDown && (
                    <DropDownMenuWrapper
                      id={key}
                      aria-invalid={errors[key] ? "true" : "false"}
                    >
                      {options.map((o, oIndex) => (
                        <React.Fragment key={`${o.key}${oIndex}`}>
                          <FormCheck style={{ padding: "8px 0px" }}>
                            <CheckedFormCheckInput
                              type="radio"
                              name={o.key}
                              id={`${o.key}`}
                              {...register(key, {
                                required: required,
                                pattern: pattern,
                              })}
                              onChange={(e) => {
                                if (e.target.checked) {
                               
                                  setSelectedForm(o.label);
                                  setOpenDropDown(false);
                                }
                              }}
                            />
                            <CheckedFormCheckLabel htmlFor={`${o.key}`}>
                              {o.label}
                            </CheckedFormCheckLabel>
                          </FormCheck>
                        </React.Fragment>
                      ))}
                    </DropDownMenuWrapper>
                  )}
                </React.Fragment>
              ) : key === "environmentDescription" ? (
                <TextArea
                  id={key}
                  {...register(key, {
                    required: required,
                    pattern: pattern,
                  })}
                  aria-invalid={errors[key] ? "true" : "false"}
                />
              ) : (
                <StyledFormControl
                  id={key}
                  {...register(key, {
                    required: required,
                    pattern: pattern,
                    // maxLength: maxLength,
                  })}
                  onKeyDown={(e) => {
                    if (e.key == " ") {
                      e.preventDefault();
                    }
                  }}
                  aria-invalid={errors[key] ? "true" : "false"}
                />
              )}
              <AlertText>
                {errors[key] && (errors[key].message as string)}
              </AlertText>
            </FormInputWrapper>
          </FormGroup>
        ))}

        <InputBtn type="submit" />
      </form> */}
      {titleFormGroups.map(({ label, key }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            <FormControl
              value={titleState[key as keyof titleType] as string}
              onChange={(e) =>
                setTitleState({ ...titleState, [key]: e.target.value })
              }
            />
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn
        onClick={() => {
          submit(titleState);
          setClickTab("地址");
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default ListingTitle;
