import React from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";

const FABStyled = styled.button`
  ${tw`bg-teal-500 text-white flex fixed rounded-full overflow-hidden text-center items-center justify-center shadow-xl text-3xl`}
  width: 3.5rem;
  height: 3.5rem;
  bottom: 100px;
  right: 20px;
  @media (min-width: 28rem) {
    right: calc(50% - 14rem + 20px);
    bottom: auto;
    top: calc(812px + 2.5rem - 100px - 3.5rem);
  }
`;

const FAB = props => {
  const { children } = props;
  return <FABStyled {...props}>{children}</FABStyled>;
};
export default FAB;
