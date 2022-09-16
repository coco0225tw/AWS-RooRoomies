import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import countyItem from '../../utils/county';
import allTowns from '../../utils/town';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  flex-direction: column;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 100%;
  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  //   width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const FormCheckInput = styled.input`
  margin: 0;
  flex-grow: 1;
  height: 19px;
`;

const FormCheck = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;

  & + & {
    margin-left: 30px;
  }

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 10px;

    & + & {
      margin-left: 27px;
    }
  }
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;

  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const FormControl = styled.input`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
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
const NextPageBtn = styled(Btn)``;
function Search() {
  const dispatch = useDispatch();
  const startRentRef = useRef<HTMLInputElement>(null);
  const endRentRef = useRef<HTMLInputElement>(null);
  const lastDocData = useSelector((state: RootState) => state.GetLastDocReducer);
  interface County {
    countyCode: number | null;
    countyName: string | null;
  }

  const [selectCounty, setSelectCounty] = useState<County>({
    countyCode: null,
    countyName: null,
  });
  const [towns, setTowns] = useState<any>();
  const [selectTown, setSelectTown] = useState<string>();
  const searchFormGroup = [
    { label: '縣市', key: 'countyname', countyOptions: countyItem },
    { label: '鄉鎮市區', key: 'townname' },
    {
      label: '租金',
      key: 'rent',
      options: [
        { label: '開始租金', key: 'startRent' },
        { label: '結束租金', key: 'endRent' },
      ],
    },
  ];

  function handleOnchange(
    county: string | null,
    town: string | null,
    startRent: string | null,
    endRent: string | null
  ) {
    console.log(startRent);
    console.log(endRent);
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
  async function nextPage(county: string | null, town: string | null) {
    firebase.getNextPageListing(lastDocData as QueryDocumentSnapshot<DocumentData>, county, town).then((listing) => {
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
  return (
    <Wrapper>
      {searchFormGroup.map(({ label, key, countyOptions, options }, index) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          {options
            ? options.map((option: any, oIndex) => (
                <FormCheck key={`${option.key}${oIndex}`}>
                  <FormCheckLabel>{option.label}</FormCheckLabel>
                  <FormCheckInput
                    onBlur={() => {
                      handleOnchange(
                        selectCounty!.countyName,
                        selectTown!,
                        startRentRef.current!.value,
                        endRentRef.current!.value
                      );
                    }}
                    ref={eval(`${option.key}Ref`)}
                    type="input"
                    name={label}
                  />
                </FormCheck>
              ))
            : countyOptions
            ? countyOptions.map((option, cIndex) => (
                <FormCheck key={`town${cIndex}`}>
                  <FormCheckInput
                    type="radio"
                    name={label}
                    // checked={selectCounty?.countyCode == option.countycode01}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleOnchange(option.countyname, null, startRentRef.current!.value, endRentRef.current!.value);
                        setSelectCounty({ countyCode: option.countycode01, countyName: option.countyname });
                        setTowns(allTowns[`townItem${option.countycode01}` as keyof typeof allTowns]);
                      }
                    }}
                  />
                  <FormCheckLabel>{option.countyname}</FormCheckLabel>
                </FormCheck>
              ))
            : towns &&
              towns.map((option: any, tIndex: any) => (
                <FormCheck key={`town${selectCounty!.countyName}${tIndex}`}>
                  <FormCheckInput
                    type="radio"
                    name="town"
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleOnchange(
                          selectCounty!.countyName,
                          option.townname,
                          startRentRef.current!.value,
                          endRentRef.current!.value
                        );
                        setSelectTown(option.townname);
                      }
                    }}
                  />
                  <FormCheckLabel>{option.townname}</FormCheckLabel>
                </FormCheck>
              ))}
        </FormGroup>
      ))}
      <NextPageBtn onClick={() => nextPage(selectCounty?.countyName, selectTown!)}>下一頁</NextPageBtn>
    </Wrapper>
  );
}

export default Search;

//   {!countyOptions &&
//     towns &&
//     towns.map((option: any, index: any) => (
//       <FormCheck key={`town${index}`}>
//         <FormCheckInput type="radio" name="town" />
//         <FormCheckLabel>{option.townname}</FormCheckLabel>
//       </FormCheck>
//     ))}
