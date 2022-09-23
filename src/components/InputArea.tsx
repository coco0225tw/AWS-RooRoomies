import styled from 'styled-components';
const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: flex-start;
  //   flex-wrap: wrap;
  flex-direction: column;

  margin-top: 30px;
  width: 100%;
  // font-size: 36px;
  ${FormLegend} + & {
    margin-top: 25px;
  }

  // @media screen and (max-width: 1279px) {
  //   line-height: 17px;
  //   font-size: 14px;
  //   margin-top: 20px;
  //   width: 100%;

  //   ${FormLegend} + & {
  //     margin-top: 20px;
  //   }
  // }
`;

const FormLabel = styled.label`
  //   width: 110px;
  // line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
  padding: 4px;
  padding-left: 0px;
  border-bottom: solid 1px #4f5152;
`;
const FormInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  // align-items: start;
  width: 100%;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
  // align-items: flex-start;
`;
const FormCheckInput = styled.input`
  letter-spacing: 1.6px;
  font-size: 20px;
  margin: 0;
  flex-grow: 1;
  // height: 19px;
  padding: 8px;
  // background-color: #c77155;
  accent-color: #c77155;
  cursor: pointer;
  // width: 12px;
  // height: 12px;
  // position: absolute;
  // top: 9px;
  // left: 10px;
  // content: ' ';
  // display: block;
  // background: #004c97;
`;

const FormCheck = styled.div`
  // margin-left: 8px;
  display: flex;
  align-items: center;
  margin-right: 30px;
  letter-spacing: 1.6px;
  font-size: 20px;
  // & + & {
  //   margin-left: 30px;
  // }

  // @media screen and (max-width: 1279px) {
  //   margin-left: 0;
  //   margin-top: 10px;

  //   & + & {
  //     margin-left: 27px;
  //   }
  // }
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;
  color: #4f5152;

  // @media screen and (max-width: 1279px) {
  //   font-size: 14px;
  // }
`;

const FormControl = styled.input`
  letter-spacing: 1.6px;
  font-size: 20px;
  width: 574px;
  // height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;
  padding: 8px;
  margin-top: 12px;
  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

export { FormLegend, FormGroup, FormLabel, FormInputWrapper, FormCheckInput, FormCheck, FormCheckLabel, FormControl };
