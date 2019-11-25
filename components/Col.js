import styled, { css } from "styled-components";
import tw from "tailwind.macro";
//import "../utils/forEach.polyfill"
import forEach from "../utils/forEach";

//Convert string fraction (e.g "1/4") to decimal (e.g. 0.25)
const stringFracToDecimal = stringFrac => {
  if (stringFrac == "1") return 1;
  if (
    !stringFrac ||
    typeof stringFrac.split !== "function" ||
    stringFrac.length < 3
  )
    return null;
  let split = stringFrac.split("/");
  if (split.length !== 2) return null;
  let a = parseInt(split[0], 10),
    b = parseInt(split[1], 10);
  if (isNaN(a) || isNaN(b)) return null;
  return parseInt(split[0], 10) / parseInt(split[1], 10);
};

const makeWidth = props => {
  //TODO breakpoint widths

  let widthStyle = `width: 100%;`;
  let w;

  if (props.w) {
    w = stringFracToDecimal(props.w) * 100;
    widthStyle = `${widthStyle}; width: ${w}%;`;
  }

  const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 }; //TODO load from tailwind config

  forEach(breakpoints, (bp, minWidth) => {
    if (props[bp]) {
      w = stringFracToDecimal(props[bp]) * 100;
      widthStyle = `${widthStyle} @media (min-width: ${minWidth}px) {width: ${w}%;}`;
    }
  });

  return widthStyle;
};

const Col = styled.div`
  ${tw`px-2`}
  ${props => makeWidth(props)}
`;
export default Col;
