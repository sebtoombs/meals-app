import styled from "styled-components/macro";
import tw from "tailwind.macro";

const Input = styled.input`
  ${tw`bg-white border border-gray-400 rounded px-3 py-2 text-lg`}
  ${props => (props.large ? tw`text-xl py-3` : null)}
`;
export default Input;
