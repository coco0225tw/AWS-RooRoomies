import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import countyItem from "../../utils/county";
import allTowns from "../../utils/town";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import carousel from "../../assets/carousel.jpg";
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../components/InputArea";
import arrow from "../../assets/arrow.png";
import { Loading } from "../../components/Loading";
import { BtnDiv } from "../../components/Button";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 200px);
  margin: auto;
  background-image: url(${carousel});
  background-size: cover;
  // background-position: cover;
  background-position: bottom;
  position: static;
  background-attachment: fixed;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const SearchBox = styled.div<{ openSearch: boolean }>`
  position: absolute;
  // margin: 0px auto;
  top: 20vh;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0px 40px 30px;
  border-radius: 12px;
  width: 80%;
  // top: 20%;
  // top: 0px;
  left: 50%;
  transform: translate(-50%, ${(props) => (props.openSearch ? "0" : "-100%")});
  opacity: ${(props) => (props.openSearch ? "1" : "0")};
`;
const SearchIcon = styled(BtnDiv)<{ openSearch: boolean }>`
  background-color: #c77155;
  color: #fff7f4;
  border-color: #fff7f4;
  &:hover {
    background-color: #c77155;
    color: #fff7f4;
    filter: grayscale(0.2);
  }
  margin: auto;
  padding: 12px;
`;
const Slogan = styled.p<{ openSearch: boolean }>`
  color: #4f5152;
  font-size: 28px;
  display: table-cell;
  text-align: center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  margin: auto;
  letter-spacing: 12px;
  opacity: ${(props) => (props.openSearch ? "0" : "1")};
  // transform: translateY(${(props) => (props.openSearch ? "100%" : "0")});
`;
const Btn = styled.div`
  cursor: pointer;
  padding: 10px;
  &:hover {
    color: white;
    background-color: grey;
    transition: 0.2s;
  }
`;
const NextPageBtn = styled(BtnDiv)`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;

const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;
  &:checked + ${CheckedFormCheckLabel} {
    // background: #c77155;
    color: #c77155;
  }
`;

const StyledFormGroup = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledFormLabel = styled(FormLabel)`
  flex-shrink: 0;
`;

const StyledFormInputWrapper = styled(FormInputWrapper)`
  margin-left: 40px;
  margin-top: 0px;
`;

const DropDown = styled(StyledFormLabel)`
  cursor: pointer;
  color: #c77155;
  border-color: #c77155;
  font-size: 28px;
  display: flex;
  align-items: center;
`;
const DropDownMenuWrapper = styled(StyledFormInputWrapper)`
  margin-left: 0px;
  position: absolute;
  background-color: #fff;
  z-index: 1;
  top: 60px;
  box-shadow: 0px 0px 3px #bbbbbb;
  width: 80%;
  padding: 20px 20px;
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
function Search({
  setLoading,
  loading,
  loadNextPage,
  loadFirstPage,
  setLoadFirstPage,
  scrollRef,
  noData,
  setNoData,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  loadNextPage: boolean;
  loadFirstPage: boolean;
  setLoadFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  noData: boolean;
  setNoData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const [selectCounty, setSelectCounty] = useState<County>({
    countyCode: 63000,
    countyName: "臺北市",
  });
  const listingDocData = useSelector(
    (state: RootState) => state.GetListingInHomePageReducer
  );
  const [selectTown, setSelectTown] = useState<string>("不限");
  const [selectRent, setSelectRent] = useState<string>("不限");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  // let loadFirstPage = false;
  const lastDocData = useSelector(
    (state: RootState) => state.GetLastDocReducer
  );
  interface County {
    countyCode: number | null;
    countyName: string | null;
  }
  const [towns, setTowns] = useState<any>();

  const countyGroup = {
    label: "縣市",
    key: "countyname",
    countyOptions: countyItem,
  };
  const townGroup = {
    label: "地區",
    key: "townname",
    townOptions: [
      { label: "不限", key: "unlimitedTown" },
      ...allTowns[
        `townItem${selectCounty.countyCode}` as keyof typeof allTowns
      ],
    ],
  };
  const rentGroup = {
    label: "租金",
    key: "rent",
    options: [
      { label: "不限", key: "unlimitedRent" },
      { label: "5000以下", key: "under5000" },
      { label: "5000~10000", key: "5000to10000" },
      { label: "10000~20000", key: "10000to20000" },
      { label: "20000以上", key: "over20000" },
    ],
  };
  const peopleGroup = {
    label: "人數",
    key: "people",
    options: [
      { label: "不限", key: "unlimitedPeople" },
      { label: "1", key: "people1" },
      { label: "2", key: "people2" },
      { label: "3", key: "people3" },
      { label: "4", key: "people4" },
    ],
  };
  async function handleOnchange(
    county: string,
    town: string | null,
    rent: string
  ) {
    setLoading(true);
    if (town === "不限") {
      town = null;
    }
    let startRent: null | number = null;
    let endRent: null | number = null;
    if (rent === "不限") {
      startRent = null;
      endRent = null;
    } else if (rent.includes("~")) {
      startRent = Number(rent.split("~")[0]);
      endRent = Number(rent.split("~")[1]);
    } else if (rent.includes("以下")) {
      startRent = null;
      endRent = Number(rent.replace("以下", ""));
    } else if (rent.includes("以上")) {
      startRent = Number(rent.replace("以上", ""));
      endRent = null;
    }

    firebase
      .getAllListings(county, town, startRent, endRent)
      .then((listing) => {
        dispatch({
          type: "GET_LISTINGDOC_FROM_FIREBASE",
          payload: { listingDocData: [] },
        });

        if (listing.empty) {
          dispatch({
            type: "GET_LISTINGDOC_FROM_FIREBASE",
            payload: { listingDocData: [] },
          });
          setNoData(true);
        } else {
          setNoData(false);

          if (!loadFirstPage) setLoadFirstPage(true);
          const lastDoc = listing.docs[listing.docs.length - 1];

          dispatch({
            type: "GET_LAST_LISTING_DOC",
            payload: { lastDocData: lastDoc },
          });
          let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
          listing.forEach((doc) => {
            listingDocArr.push(doc);
          });
          dispatch({
            type: "GET_LISTINGDOC_FROM_FIREBASE",
            payload: { listingDocData: listingDocArr },
          });
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }
  async function nextPage(
    county: string | null,
    town: string | null,
    rent: string
  ) {
    if (town === "不限") {
      town = null;
    }
    let startRent: null | number = null;
    let endRent: null | number = null;
    if (rent === "不限") {
      startRent = null;
      endRent = null;
    } else if (rent.includes("~")) {
      startRent = Number(rent.split("~")[0]);
      endRent = Number(rent.split("~")[1]);
    } else if (rent.includes("以下")) {
      startRent = null;
      endRent = Number(rent.replace("以下", ""));
    } else if (rent.includes("以上")) {
      startRent = Number(rent.replace("以上", ""));
      endRent = null;
    }

    setLoading(true);
    firebase
      .getNextPageListing(
        lastDocData as QueryDocumentSnapshot<DocumentData>,
        county,
        town,
        startRent,
        endRent
      )
      .then((listing) => {
        if (listing.empty) {
          setLoading(false);
          setNoData(true);
        } else {
          setNoData(false);

          const lastDoc = listing.docs[listing.docs.length - 1];

          dispatch({
            type: "GET_LAST_LISTING_DOC",
            payload: { lastDocData: lastDoc },
          });
          let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
          listing.forEach((doc) => {
            listingDocArr.push(doc);
          });
          dispatch({
            type: "GET_NEXTPAGE_LISTINGDOC_FROM_FIREBASE",
            payload: { listingDocData: listingDocArr },
          });
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      });
  }
  function clickOnDropDown() {
    setOpenDropDown(true);
  }
  function selectCountyFunction() {
    setOpenDropDown(false);
  }

  const handleObserver = useCallback(
    async (entries: any, observer: any) => {
      let isFetching = false;

      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (noData) return;
      isFetching = true;

      if (!loadFirstPage) {
        await handleOnchange(selectCounty?.countyName, "不限", "不限");

        isFetching = false;
      } else {
        await nextPage(selectCounty?.countyName, selectTown!, selectRent!);
        isFetching = false;
      }
    },
    [lastDocData, selectCounty, selectTown, selectRent, loadFirstPage, noData]
  );
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(handleObserver);
    intersectionObserver.observe(scrollRef!.current);
    const waypoint = scrollRef!.current;
    return () => {
      intersectionObserver.unobserve(waypoint);
    };
  }, [
    lastDocData,
    selectCounty,
    selectTown,
    selectRent,
    loadFirstPage,
    noData,
  ]);
  return (
    <Wrapper>
      <Slogan openSearch={openSearch}>房子是租來的，生活不是</Slogan>
      <SearchIcon
        openSearch={openSearch}
        onClick={() => {
          if (openSearch) {
            setOpenSearch(false);
          } else {
            setOpenSearch(true);
          }
        }}
      >
        {openSearch ? "關閉搜尋" : "開始搜尋"}
      </SearchIcon>
      <SearchBox openSearch={openSearch}>
        <StyledFormGroup
          style={{ flexDirection: "column" }}
          key={countyGroup.key}
        >
          {/* <StyledFormLabel>{countyGroup.label}</StyledFormLabel> */}
          <DropDown
            onClick={() =>
              openDropDown ? setOpenDropDown(false) : setOpenDropDown(true)
            }
          >
            {selectCounty.countyName}
            <span>
              <DropDownIcon openDropDown={openDropDown} />
            </span>
          </DropDown>
          {openDropDown && (
            <DropDownMenuWrapper>
              {countyGroup.countyOptions.map((option: any, oIndex) => (
                <React.Fragment key={`${option.key}${oIndex}`}>
                  <FormCheck style={{ padding: "8px 0px" }}>
                    <CheckedFormCheckInput
                      defaultChecked={
                        selectCounty.countyCode === option.countycode01
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectCounty({
                            countyCode: option.countycode01,
                            countyName: option.countyname,
                          });
                          setSelectTown("不限");
                        }
                        handleOnchange(option.countyname, "不限", selectRent!);
                        setOpenDropDown(false);
                      }}
                      type="radio"
                      name={countyGroup.key}
                      id={`${option.countyname}`}
                    />
                    <CheckedFormCheckLabel htmlFor={`${option.countyname}`}>
                      {option.countyname}
                    </CheckedFormCheckLabel>
                  </FormCheck>
                </React.Fragment>
              ))}
            </DropDownMenuWrapper>
          )}
        </StyledFormGroup>
        <StyledFormGroup key={townGroup.key}>
          <StyledFormLabel>{townGroup.label}</StyledFormLabel>
          <StyledFormInputWrapper>
            {selectCounty &&
              townGroup.townOptions.map((option: any, oIndex) => (
                <div key={`${selectCounty.countyCode}${option.key}${oIndex}`}>
                  <FormCheck style={{ padding: "8px 0px" }}>
                    <CheckedFormCheckInput
                      defaultChecked={option.key ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectTown(
                            option.key ? option.label : option.townname
                          );
                        }
                        handleOnchange(
                          selectCounty!.countyName!,
                          option.key ? option.label : option.townname,
                          selectRent!
                        );
                      }}
                      type="radio"
                      name={townGroup.key}
                      id={`${option.townname}`}
                    />
                    <CheckedFormCheckLabel htmlFor={`${option.townname}`}>
                      {option.key ? option.label : option.townname}
                    </CheckedFormCheckLabel>
                  </FormCheck>
                </div>
              ))}
          </StyledFormInputWrapper>
        </StyledFormGroup>
        <StyledFormGroup key={rentGroup.key}>
          <StyledFormLabel>{rentGroup.label}</StyledFormLabel>
          <StyledFormInputWrapper>
            {rentGroup.options.map((option: any, oIndex) => (
              <div key={`${option.key}${oIndex}`}>
                <FormCheck style={{ padding: "8px 0px" }}>
                  <CheckedFormCheckInput
                    defaultChecked={option.key.includes("unlimited")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectRent(option.label);
                      }
                      handleOnchange(
                        selectCounty!.countyName!,
                        selectTown!,
                        option.label
                      );
                    }}
                    type="radio"
                    name={rentGroup.key}
                    id={`${option.key}`}
                  />
                  <CheckedFormCheckLabel htmlFor={`${option.key}`}>
                    {option.label}
                    {/* {option.key ? option.label : option.townname} */}
                  </CheckedFormCheckLabel>
                </FormCheck>
              </div>
            ))}
          </StyledFormInputWrapper>
        </StyledFormGroup>
      </SearchBox>
    </Wrapper>
  );
}

export default Search;
