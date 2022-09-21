import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const BtnLink = styled(Link)`
  color: #4f5152;
  font-size: 16px;
  letter-spacing: 4px;
  padding: 4px 12px;
  transition-duration: 0.2s;
  cursor: pointer;
  display: block
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
  &:hover {
    background-color: #ece2d5;
  }
`;
export { BtnLink, BtnDiv };
