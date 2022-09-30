import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
  border: solid 1px #4f5152;
  &:hover {
    background-color: #ece2d5;
  }
`;
const InputBtn = styled.input.attrs({
  type: "submit",
})`
  color: #4f5152;
  font-size: 16px;
  letter-spacing: 4px;
  padding: 4px 12px;
  transition-duration: 0.2s;
  cursor: pointer;
  border: solid 1px #4f5152;
  background-color: #fff;
  &:hover {
    background-color: #ece2d5;
  }
  margin-top: 12px;
  align-self: flex-end;
`;
export { BtnLink, BtnDiv, InputBtn };
