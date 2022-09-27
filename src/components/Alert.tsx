import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
const Wrapper = styled.div<{ isAlert: boolean }>`
  position: fixed;
  display: flex;
  z-index: 1;
  background-color: #222;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  color: #4f5152;
  top: 20vh;
  right: 80px;
  padding: 20px 40px;
  border-radius: 20px;
  transform: translateX(${(props) => (props.isAlert ? "0%" : "200%")});
  transition-duration: 2s;
`;
const Message = styled.div<{ alertType: string }>`
  font-size: 28px;
  color: ${(props) =>
    (props.alertType === "提示" && "#eee") ||
    (props.alertType === "錯誤" && "red") ||
    (props.alertType === "成功" && "green")};
`;

function Alert({
  alertType,
  alertMessage,
  isAlert,
}: {
  alertType: string;
  alertMessage: string;
  isAlert: boolean;
}) {
  return (
    <Wrapper isAlert={isAlert}>
      <Message alertType={alertType}>{alertMessage}</Message>
    </Wrapper>
  );
}
export default Alert;
