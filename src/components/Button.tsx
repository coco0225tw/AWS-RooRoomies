import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BtnLink = styled(Link)`
  color: #4f5152;
  font-size: 16px;
  letter-spacing: 4px;
  padding: 4px 12px;
  transition-duration: 0.2s;
  cursor: pointer;
  display: block;
  border-bottom: solid 1px #4f5152;

  &:hover {
    background-color: #ece2d5;
  }
`;

const BtnDiv = styled.div`
  color: #4f5152;
  font-size: 16px;
  letter-spacing: 4px;
  padding: 4px 12px;
  transition-duration: 0.2s;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  &:hover {
    background-color: #ece2d5;
  }
`;
const InputBtn = styled.input.attrs({
  // type: "submit",
})`
 color: #4f5152;
  font-size: 16px;
  letter-spacing: 4px;
  padding: 4px 12px;
  transition-duration: 0.2s;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border: none;
  &:hover {
    background-color: #ece2d5;
  }
`;
const SubmitBtn = styled(InputBtn)`
  background-color: #fff;
  align-self: flex-end;
  margin-top: 20px;
  border: solid 1px black;
`;
export { BtnLink, BtnDiv, InputBtn, SubmitBtn };
