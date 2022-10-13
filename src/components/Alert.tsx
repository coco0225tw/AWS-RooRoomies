import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ isAlert: boolean; alertType: string }>`
  position: fixed;
  display: flex;
  z-index: 3;
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  top: 20vh;
  right: 80px;
  padding: 20px 40px;
  border-radius: 4px;
  transform: translateX(${(props) => (props.isAlert ? '0%' : '200%')});
  transition-duration: 2s;
  border-left: solid 12px
    ${(props) =>
      (props.alertType === 'notify' && '#c77155') ||
      (props.alertType === 'error' && '#cc0000') ||
      (props.alertType === 'success' && 'green')};
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 960px) {
    top: 10vh;
    right: 40px;
  }
  @media screen and (max-width: 550px) {
    right: 10px;
    padding: 12px 24px;
  }
`;
const Message = styled.div`
  font-size: 24px;
  letter-spacing: 4px;
  color: #4f5152;
  @media screen and (max-width: 550px) {
    font-size: 20px;
    letter-spacing: 1.6px;
  }
`;

function Alert({ alertType, alertMessage, isAlert }: { alertType: string; alertMessage: any; isAlert: boolean }) {
  return (
    <Wrapper isAlert={isAlert} alertType={alertType}>
      <Message>{alertMessage}</Message>
    </Wrapper>
  );
}
export default Alert;
