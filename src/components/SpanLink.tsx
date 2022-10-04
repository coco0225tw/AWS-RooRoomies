import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Wrapper = styled(Link)`
  color: #c77155;
  border-bottom: solid 1px #c77155;
`;

function SpanLink({
  path,
  msg,
  otherFn,
}: {
  path: string;
  msg: string;
  otherFn: any;
}) {
  return (
    <Wrapper
      style={{
        fontSize: "inherit",
        letterSpacing: "inherit",
      }}
      onClick={() => {
        otherFn();
      }}
      to={path}
    >
      {msg}
    </Wrapper>
  );
}
export default SpanLink;
