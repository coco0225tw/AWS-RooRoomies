import styled from "styled-components";
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
  flex-direction: column;

  margin-top: 30px;
  width: 100%;
  ${FormLegend} + & {
    margin-top: 25px;
  }
`;

const FormLabel = styled.label`
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
  width: 100%;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
const FormCheckInput = styled.input`
  letter-spacing: 1.6px;
  font-size: 20px;
  margin: 0;
  flex-grow: 1;
  padding: 8px;
  accent-color: #c77155;
  cursor: pointer;
`;

const FormCheck = styled.div`
  // margin-left: 8px;
  display: flex;
  align-items: center;
  margin-right: 30px;
  letter-spacing: 1.6px;
  font-size: 20px;
`;

const FormCheckLabel = styled.label`
  margin-left: 10px;
  line-height: 26px;
  color: #4f5152;
`;

const FormControl = styled.input`
  letter-spacing: 1.6px;
  font-size: 20px;
  width: 100%;
  border-radius: 8px;
  border: solid 1px #979797;
  padding: 8px;
  margin-top: 12px;
  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

export {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
};
