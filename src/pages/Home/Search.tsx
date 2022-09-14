import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import countyItem from '../../utils/county';
import allTowns from '../../utils/town';
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

function Search() {
  interface County {
    countyCode: number;
    countyName: string;
  }
  const [selectCounty, setSelectCounty] = useState<County>();
  const [towns, setTowns] = useState<any>();
  const [selectTown, setSelectTown] = useState<number>();
  const searchFormGroup = [
    { label: '縣市', key: 'countyname', countyOptions: countyItem },
    { label: '鄉鎮市區', key: 'townname' },
  ];
  console.log(towns);
  return (
    <Wrapper>
      {searchFormGroup.map(({ label, key, countyOptions }, index) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          {countyOptions
            ? countyOptions.map((option, cIndex) => (
                <FormCheck key={`town${cIndex}`}>
                  <FormCheckInput
                    type="radio"
                    name={label}
                    // checked={selectCounty?.countyCode == option.countycode01}
                    onChange={(e) => {
                      if (e.target.checked) {
                        console.log('checked');
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
                  <FormCheckInput type="radio" name="town" />
                  <FormCheckLabel>{option.townname}</FormCheckLabel>
                </FormCheck>
              ))}
        </FormGroup>
      ))}
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
