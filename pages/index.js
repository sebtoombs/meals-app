import React from "react";

import styled from "styled-components/macro";
import tw from "tailwind.macro";

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Test = styled.div`
  ${tw`bg-red-500 text-white`}
`;

export default () => (
  <>
    <Title>My page</Title>
    <Test>Test</Test>
  </>
);
