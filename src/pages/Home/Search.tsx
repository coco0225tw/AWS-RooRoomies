import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { RootState } from '../../redux/rootReducer';
import { lastDocAction } from '../../redux/LastDoc/LastDocAction';
import { listingForHomePageAction } from '../../redux/ListingDocumentForHomePage/ListingDocumentForHomePageAction';
import { firebase } from '../../utils/firebase';

import countyItem from '../../utils/county';
import allTowns from '../../utils/town';
import carousel from '../../assets/carousel.jpg';
import search from '../../assets/search.svg';

import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
} from '../../components/InputArea';
import arrow from '../../assets/arrow.png';
import { BtnDiv } from '../../components/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 160px);
  margin: auto;
  background-image: url(${carousel});
  background-size: cover;
  background-position: bottom;
  position: static;
  background-attachment: fixed;
  background-repeat: no-repeat;
  z-index: 1;
  @media screen and (max-width: 960px) {
    height: 30vh;
    background-size: contain;
    background-position: top;
  }
  @media screen and (max-width: 660px) {
    height: 24vh;
  }
  @media screen and (max-width: 450px) {
    background-size: cover;
    background-position: bottom;
    background-attachment: local;
  }
`;

const SearchBox = styled.div<{ openSearch: boolean }>`
  position: absolute;
  top: 20vh;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0px 40px 30px;
  border-radius: 12px;
  width: 80%;
  left: 50%;
  transform: translate(-50%, ${(props) => (props.openSearch ? '0' : '-100%')});
  opacity: ${(props) => (props.openSearch ? '1' : '0')};
  /* z-index: 1; */
  @media screen and (max-width: 1260px) {
    width: 90%;
    top: 10vh;
  }
  @media screen and (max-width: 960px) {
    top: 6vh;
    padding: 0px 40px;
  }
  @media screen and (max-width: 660px) {
    top: 3vh;
  }
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
  z-index: 4;

  @media screen and (max-width: 1260px) {
    ${(props) => props.openSearch && 'position: absolute;right: calc(5% + 40px); z-index: 1;top: calc(10vh + 30px);'}
  }
  @media screen and (max-width: 960px) {
    display: ${(props) => !props.openSearch && 'none'};

    top: ${(props) => props.openSearch && 'calc(6vh + 10px)'};
    padding: 4px 8px;
    font-size: 12px;
  }
  @media screen and (max-width: 660px) {
    top: ${(props) => props.openSearch && 'calc(3vh + 10px)'};
  }
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
  opacity: ${(props) => (props.openSearch ? '0' : '1')};
  @media screen and (max-width: 960px) {
    writing-mode: horizontal-tb;
  }
  @media screen and (max-width: 660px) {
    font-size: 20px;
    letter-spacing: 4px;
  }
  @media screen and (max-width: 450px) {
    font-size: 16px;
  }
`;

const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
  white-space: nowrap;
  @media screen and (max-width: 960px) {
    font-size: 16px;
  }
`;
const CheckedFormCheckInput = styled(FormCheckInput)`
  display: none;
  &:checked + ${CheckedFormCheckLabel} {
    color: #c77155;
  }
`;

const StyledFormGroup = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 960px) {
    margin-top: 0px;
    margin-bottom: 8px;
  }
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
  @media screen and (max-width: 960px) {
    font-size: 20px;
  }
`;
const DropDownMenuWrapper = styled(StyledFormInputWrapper)`
  margin-left: 0px;
  position: absolute;
  background-color: #fff;
  z-index: 2;
  top: 60px;
  box-shadow: 0px 0px 3px #bbbbbb;
  width: 80%;
  padding: 20px 20px;
  @media screen and (max-width: 660px) {
    width: 100%;
  }
`;
const OverflowMenuWrapper = styled(StyledFormInputWrapper)`
  @media screen and (max-width: 960px) {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    flex-wrap: nowrap;
    margin-left: 8px;
    ::-webkit-scrollbar {
      height: 1px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c77155;
    }
  }
`;
const FormCheckElement = styled(FormCheck)`
  padding: 8px 0px;
  flex-basis: auto;
  @media screen and (max-width: 960px) {
    padding: 0 0 4px;
  }
  @media screen and (max-width: 550px) {
    width: 100%;
    margin-right: 0px;
  }
`;
const DropDownIcon = styled.div<{ openDropDown: boolean }>`
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  background-image: url(${arrow});
  background-position: center;
  transform: ${(props) => (props.openDropDown ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition-duration: 0.2s;
  margin-left: 20px;
  border: solid 1px #fff7f4;
  @media screen and (max-width: 960px) {
    font-size: 16px;
    margin-left: 12px;
  }
`;
const SearchIconForMobile = styled.div`
  background-image: url(${search});
  background-color: #ffffff;
  border-radius: 8px;
  position: absolute;
  right: 0;
  width: 48px;
  height: 48px;
  background-size: 40px 40px;
  background-position: center;
  display: none;
  z-index: 1;
  cursor: pointer;
  background-repeat: no-repeat;
  transform: translate(120%, -100%);
  @media screen and (max-width: 960px) {
    display: block;
  }
  @media screen and (max-width: 660px) {
    width: 36px;
    height: 36px;
    background-size: 28px 28px;
  }
`;
function Search({
  setLoading,
  loadFirstPage,
  setLoadFirstPage,
  scrollRef,
  noData,
  setNoData,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadFirstPage: boolean;
  setLoadFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  noData: boolean;
  setNoData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();

  const [selectTown, setSelectTown] = useState<string>('不限');
  const [selectRent, setSelectRent] = useState<string>('不限');
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const lastDocData = useSelector((state: RootState) => state.GetLastDocReducer);
  interface County {
    countyCode: number | null;
    countyName: string | null;
  }

  const [selectCounty, setSelectCounty] = useState<County>({
    countyCode: 63000,
    countyName: '臺北市',
  });

  const countyGroup = {
    label: '縣市',
    key: 'countyname',
    countyOptions: countyItem,
  };
  const townGroup = {
    label: '地區',
    key: 'townname',
    townOptions: [
      { label: '不限', key: 'unlimitedTown' },
      ...allTowns[`townItem${selectCounty.countyCode}` as keyof typeof allTowns],
    ],
  };
  interface townOptionType {
    towncode: number;
    towncode01: string;
    townname: string;
  }
  interface labelType {
    label: string;
    key: string;
  }
  const rentGroup = {
    label: '租金',
    key: 'rent',
    options: [
      { label: '不限', key: 'unlimitedRent' },
      { label: '5000以下', key: 'under5000' },
      { label: '5000~10000', key: '5000to10000' },
      { label: '10000~20000', key: '10000to20000' },
      { label: '20000以上', key: 'over20000' },
    ],
  };

  async function handleOnchange(county: string, town: string | null, rent: string) {
    setLoading(true);
    if (town === '不限') {
      town = null;
    }
    let startRent: null | number = null;
    let endRent: null | number = null;
    if (rent === '不限') {
      startRent = null;
      endRent = null;
    } else if (rent.includes('~')) {
      startRent = Number(rent.split('~')[0]);
      endRent = Number(rent.split('~')[1]);
    } else if (rent.includes('以下')) {
      startRent = null;
      endRent = Number(rent.replace('以下', ''));
    } else if (rent.includes('以上')) {
      startRent = Number(rent.replace('以上', ''));
      endRent = null;
    }

    firebase.getAllListings(county, town, startRent, endRent).then((listing) => {
      dispatch({
        type: listingForHomePageAction.GET_LISTING_DOCS_FROM_FIREBASE,
        payload: { listingDocData: [] },
      });

      if (listing.empty) {
        dispatch({
          type: listingForHomePageAction.GET_LISTING_DOCS_FROM_FIREBASE,
          payload: { listingDocData: [] },
        });
        setNoData(true);
      } else {
        setNoData(false);

        if (!loadFirstPage) setLoadFirstPage(true);
        const lastDoc = listing.docs[listing.docs.length - 1];

        dispatch({
          type: lastDocAction.GET_LAST_LISTING_DOC,
          payload: { lastDocData: lastDoc },
        });
        let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          listingDocArr.push(doc);
        });
        dispatch({
          type: listingForHomePageAction.GET_LISTING_DOCS_FROM_FIREBASE,
          payload: { listingDocData: listingDocArr },
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }
  async function nextPage(county: string | null, town: string | null, rent: string) {
    if (town === '不限') {
      town = null;
    }
    let startRent: null | number = null;
    let endRent: null | number = null;
    if (rent === '不限') {
      startRent = null;
      endRent = null;
    } else if (rent.includes('~')) {
      startRent = Number(rent.split('~')[0]);
      endRent = Number(rent.split('~')[1]);
    } else if (rent.includes('以下')) {
      startRent = null;
      endRent = Number(rent.replace('以下', ''));
    } else if (rent.includes('以上')) {
      startRent = Number(rent.replace('以上', ''));
      endRent = null;
    }

    setLoading(true);
    firebase
      .getNextPageListing(lastDocData as QueryDocumentSnapshot<DocumentData>, county, town, startRent, endRent)
      .then((listing) => {
        if (listing.empty) {
          setLoading(false);
          setNoData(true);
        } else {
          setNoData(false);

          const lastDoc = listing.docs[listing.docs.length - 1];

          dispatch({
            type: lastDocAction.GET_LAST_LISTING_DOC,
            payload: { lastDocData: lastDoc },
          });
          let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
          listing.forEach((doc) => {
            listingDocArr.push(doc);
          });
          dispatch({
            type: listingForHomePageAction.GET_NEXT_PAGE_LISTING_DOCS_FROM_FIREBASE,
            payload: { listingDocData: listingDocArr },
          });
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      });
  }

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      let isFetching = false;

      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (noData) return;
      isFetching = true;

      if (!loadFirstPage) {
        await handleOnchange(selectCounty?.countyName, '不限', '不限');

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
  }, [lastDocData, selectCounty, selectTown, selectRent, loadFirstPage, noData]);
  return (
    <Wrapper>
      <Slogan openSearch={openSearch}>
        房子是租來的，生活不是{' '}
        <SearchIconForMobile
          onClick={() => {
            setOpenSearch(!openSearch);
          }}
        />
      </Slogan>

      <SearchIcon
        openSearch={openSearch}
        onClick={() => {
          setOpenSearch(!openSearch);
        }}
      >
        {openSearch ? '關閉搜尋' : '開始搜尋'}
      </SearchIcon>
      <SearchBox openSearch={openSearch}>
        <StyledFormGroup style={{ flexDirection: 'column' }} key={countyGroup.key}>
          <DropDown onClick={() => (openDropDown ? setOpenDropDown(false) : setOpenDropDown(true))}>
            {selectCounty.countyName}
            <span>
              <DropDownIcon openDropDown={openDropDown} />
            </span>
          </DropDown>
          {openDropDown && (
            <DropDownMenuWrapper>
              {countyGroup.countyOptions.map((option, oIndex) => (
                <React.Fragment key={`${option.countycode}${oIndex}`}>
                  <FormCheck style={{ padding: '8px 0px' }}>
                    <CheckedFormCheckInput
                      defaultChecked={selectCounty.countyCode === option.countycode01}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectCounty({
                            countyCode: option.countycode01,
                            countyName: option.countyname,
                          });
                          setSelectTown('不限');
                        }
                        handleOnchange(option.countyname, '不限', selectRent!);
                        setOpenDropDown(false);
                      }}
                      type="radio"
                      name={countyGroup.key}
                      id={`${option.countyname}`}
                    />
                    <CheckedFormCheckLabel htmlFor={`${option.countyname}`}>{option.countyname}</CheckedFormCheckLabel>
                  </FormCheck>
                </React.Fragment>
              ))}
            </DropDownMenuWrapper>
          )}
        </StyledFormGroup>
        <StyledFormGroup key={townGroup.key}>
          <StyledFormLabel>{townGroup.label}</StyledFormLabel>
          <OverflowMenuWrapper>
            {selectCounty &&
              townGroup.townOptions.map((option: townOptionType | labelType, oIndex) => (
                <div key={`${selectCounty.countyCode}${(option as labelType).key}${oIndex}`}>
                  <FormCheckElement>
                    <CheckedFormCheckInput
                      defaultChecked={(option as labelType).key ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectTown(
                            (option as labelType).key
                              ? (option as labelType).label
                              : (option as townOptionType).townname
                          );
                        }
                        handleOnchange(
                          selectCounty!.countyName!,
                          (option as labelType).key ? (option as labelType).label : (option as townOptionType).townname,
                          selectRent!
                        );
                      }}
                      type="radio"
                      name={townGroup.key}
                      id={`${(option as townOptionType).townname}`}
                    />
                    <CheckedFormCheckLabel htmlFor={`${(option as townOptionType).townname}`}>
                      {(option as labelType).key ? (option as labelType).label : (option as townOptionType).townname}
                    </CheckedFormCheckLabel>
                  </FormCheckElement>
                </div>
              ))}
          </OverflowMenuWrapper>
        </StyledFormGroup>
        <StyledFormGroup key={rentGroup.key}>
          <StyledFormLabel>{rentGroup.label}</StyledFormLabel>
          <OverflowMenuWrapper>
            {rentGroup.options.map((option, oIndex) => (
              <React.Fragment key={`${option.key}${oIndex}`}>
                <FormCheckElement>
                  <CheckedFormCheckInput
                    defaultChecked={option.key.includes('unlimited')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectRent(option.label);
                      }
                      handleOnchange(selectCounty!.countyName!, selectTown!, option.label);
                    }}
                    type="radio"
                    name={rentGroup.key}
                    id={`${option.key}`}
                  />
                  <CheckedFormCheckLabel htmlFor={`${option.key}`}>{option.label}</CheckedFormCheckLabel>
                </FormCheckElement>
              </React.Fragment>
            ))}
          </OverflowMenuWrapper>
        </StyledFormGroup>
      </SearchBox>
    </Wrapper>
  );
}

export default Search;
