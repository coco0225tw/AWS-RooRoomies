import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { BtnLink, BtnDiv } from "./Button";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.5);
  // position: fixed;
  // top: 0;
  // left: 0;
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
const LoaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height 100%;
  justify-content: center;
  align-items: center;
`;
const preloader = keyframes`
  100% { transform: scale(1.6);
`;
const LoaderComponent = styled.span`
  border-radius: 100%;
  width: 20px;
  height: 20px;
  background-color: #c77155;
  // border: 1px solid #c77155;
  margin: 40px;
  &:nth-child(1) {
    animation: ${preloader} 0.6s ease-in-out alternate infinite;
  }
  &:nth-child(2) {
    animation: ${preloader} 0.6s ease-in-out alternate 0.2s infinite;
  }
  &:nth-child(3) {
    animation: ${preloader} 0.6s ease-in-out alternate 0.4s infinite;
  }
`;

function Loading() {
  return (
    <Wrapper>
      <LoaderWrapper>
        <LoaderComponent />
        <LoaderComponent />
        <LoaderComponent />
      </LoaderWrapper>
    </Wrapper>
    //   )}
    // </div>
  );
}
export { Loading };
