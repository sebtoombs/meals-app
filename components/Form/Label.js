import styled, { css } from "styled-components/macro";
import tw from "tailwind.macro";

const Label = styled.label`
  ${tw`text-lg font-bold`}
  ${props =>
    props.isOptional
      ? `&:after {content: "(optional)"; font-size: 1rem; margin-left:0.25rem; font-weight: 400;}`
      : null}
`;
export default Label;
