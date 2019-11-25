import styled from "styled-components/macro";
import tw from "tailwind.macro";

import Input from "./Input";
import Label from "./Label";
import FormText from "./FormText";

const FormGroup = styled.div`
  ${tw`mb-5`}

  ${Label} {
    ${tw`block w-full`}
  }

  ${Input} {
    ${tw`block w-full`}
  }

  ${Label} ~ ${Input} {
    ${tw`mt-3`}
  }

  ${Input} + ${FormText} {
    ${tw`mt-2`}
  }
`;
export default FormGroup;
