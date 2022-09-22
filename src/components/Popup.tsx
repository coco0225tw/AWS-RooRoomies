import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BtnLink, BtnDiv } from './Button';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 999;
  justify-content: center;
`;

const Popup = styled.div`
  width: 30%;
  background-color: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Message = styled.div`
  text-align: center;
  font-size: 32px;
  letter-spacing: 8px;
  height: 20vh;
`;
const BtnArea = styled.div`
  display: flex;
  justify-content: space-around;
`;
const DefaultBtn = styled(BtnDiv)`
  background-color: #ece2d5;
  &:hover {
    background-color: #fff7f4;
    border: solid 1px #ece2d5;
  }
`;

const NotDefaultBtn = styled(BtnDiv)`
  &:hover {
    border: solid 1px #ece2d5;
    background-color: #fff7f4;
  }
`;
const Close = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 50%;
  line-height: 20px;
  cursor: pointer;
  font-size: 12px;
  transform: translate(-200%, -200%);
  &:hover {
    border: solid 1px #ece2d5;
    background-color: #fff7f4;
  }
`;
function PopupComponent({
  msg,
  notDefaultBtn,
  defaultBtn,
  clickClose,
  clickFunction,
}: {
  msg: string;
  notDefaultBtn: string;
  defaultBtn: string;
  clickClose: any;
  clickFunction: any;
}) {
  return (
    <Wrapper>
      <Popup>
        <Close onClick={clickClose}>x</Close>
        <Message>{msg}</Message>
        <BtnArea>
          <NotDefaultBtn
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              clickClose();
            }}
          >
            {notDefaultBtn}
          </NotDefaultBtn>
          <DefaultBtn
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              clickFunction();
            }}
          >
            {defaultBtn}
          </DefaultBtn>
        </BtnArea>
      </Popup>
    </Wrapper>
  );
}
export default PopupComponent;
