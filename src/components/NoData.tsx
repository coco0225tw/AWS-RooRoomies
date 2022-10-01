import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Logo from "../assets/noHouse.png";
const NoLogo = styled.div`
  width: 10vw;
  // top: 10vh;
  aspect-ratio: 1/1;
  background-image: url(${Logo});
  background-size: cover;
  background-position: center center;
`;
const NoText = styled.div`
  font-size: 28px;
  letter-spacing: 2px;
  color: #d7d7d7;
  margin-left: 20px;
  font-weight: bold;
`;
const NoArea = styled.div`
  margin: auto;
  margin-top: 10vh;
  display: flex;
  align-items: center;
  // flex-direction: column;
`;

function NoListing({ msg }: { msg: string }) {
  return (
    <NoArea>
      <NoLogo />
      <NoText>{msg}</NoText>
    </NoArea>
  );
}
export default NoListing;
