import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import countyItem from '../../utils/county';
import allTowns from '../../utils/town';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import carousel from '../../assets/carousel.jpg';
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../components/InputArea';
import arrow from '../../assets/arrow.png';
// import { RootState } from '../../../redux/rootReducer';
import { BtnDiv } from '../../components/Button';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 50vh;
  margin: auto;
  background-image: url(${carousel});
  background-size: cover;
  // background-position: cover;
  background-position: bottom;
  position: static;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const SearchBox = styled.div`
  position: absolute;
  margin: 80px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0px 20px 30px;
  width: 50%;
  // top: 20%;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
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
  transform: ${(props) => (props.openDropDown ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition-duration: 0.2s;
  margin-left: 20px;
  border: solid 1px #fff7f4;
`;
function Search() {
  const dispatch = useDispatch();
  const [selectCounty, setSelectCounty] = useState<County>({
    countyCode: 63000,
    countyName: '臺北市',
  });
  const [selectTown, setSelectTown] = useState<string>('不限');
  const [selectRent, setSelectRent] = useState<string>('不限');
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const lastDocData = useSelector((state: RootState) => state.GetLastDocReducer);
  interface County {
    countyCode: number | null;
    countyName: string | null;
  }
  const [towns, setTowns] = useState<any>();

  const countyGroup = { label: '縣市', key: 'countyname', countyOptions: countyItem };
  const townGroup = {
    label: '地區',
    key: 'townname',
    townOptions: [
      { label: '不限', key: 'unlimitedTown' },
      ...allTowns[`townItem${selectCounty.countyCode}` as keyof typeof allTowns],
    ],
  };
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
  const peopleGroup = {
    label: '人數',
    key: 'people',
    options: [
      { label: '不限', key: 'unlimitedPeople' },
      { label: '1', key: 'people1' },
      { label: '2', key: 'people2' },
      { label: '3', key: 'people3' },
      { label: '4', key: 'people4' },
    ],
  };
  function handleOnchange(county: string, town: string | null, rent: string) {
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
      if (listing.empty) {
        dispatch({ type: 'GET_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: [] } });
        dispatch({ type: 'GET_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: null } });
      } else {
        dispatch({ type: 'GET_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: [] } });
        const lastDoc = listing.docs[listing.docs.length - 1];
        dispatch({ type: 'GET_LAST_LISTING_DOC', payload: { lastDocData: lastDoc } });
        let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          listingDocArr.push(doc);
        });
        dispatch({ type: 'GET_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: listingDocArr } });
      }
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
    firebase
      .getNextPageListing(lastDocData as QueryDocumentSnapshot<DocumentData>, county, town, startRent, endRent)
      .then((listing) => {
        if (listing.empty) return;
        const lastDoc = listing.docs[listing.docs.length - 1];
        dispatch({ type: 'GET_LAST_LISTING_DOC', payload: { lastDocData: lastDoc } });
        let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          listingDocArr.push(doc);
        });
        dispatch({ type: 'GET_NEXTPAGE_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: listingDocArr } });
      });
  }
  function clickOnDropDown() {
    setOpenDropDown(true);
  }
  function selectCountyFunction() {
    setOpenDropDown(false);
  }
  useEffect(() => {
    handleOnchange(selectCounty.countyName!, '不限', '不限');
  }, []);
  return (
    <Wrapper>
      <SearchBox>
        <StyledFormGroup style={{ flexDirection: 'column' }} key={countyGroup.key}>
          {/* <StyledFormLabel>{countyGroup.label}</StyledFormLabel> */}
          <DropDown onClick={() => (openDropDown ? setOpenDropDown(false) : setOpenDropDown(true))}>
            {selectCounty.countyName}
            <span>
              <DropDownIcon openDropDown={openDropDown} />
            </span>
          </DropDown>
          {openDropDown && (
            <DropDownMenuWrapper>
              {countyGroup.countyOptions.map((option: any, oIndex) => (
                <div key={`${option.key}${oIndex}`}>
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
                    <CheckedFormCheckLabel htmlFor={`${option.countyname}`}>
                      {option.countyname}
                      {/* {option.countycode01} */}
                    </CheckedFormCheckLabel>
                  </FormCheck>
                </div>
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
                  <FormCheck style={{ padding: '8px 0px' }}>
                    <CheckedFormCheckInput
                      defaultChecked={option.key ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectTown(option.key ? option.label : option.townname);
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
                <FormCheck style={{ padding: '8px 0px' }}>
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
      <NextPageBtn onClick={() => nextPage(selectCounty?.countyName, selectTown!, selectRent!)}>下一頁</NextPageBtn>
    </Wrapper>
  );
}

export default Search;
