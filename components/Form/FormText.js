import styled from "styled-components/macro";
import tw from "tailwind.macro";

const FormText = styled.span`
  ${tw`text-base block`}
  ${props => (props.isError ? tw`text-red-600` : null)}
  ${props => (props.isHidden ? tw`hidden` : null)}
`;
export default FormText;

const FormError = styled(FormText)`
  ${tw`text-red-600`}
`;
export { FormError };
