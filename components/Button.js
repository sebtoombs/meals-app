import styled from "styled-components/macro";
import tw from "tailwind.macro";

const ButtonStyled = styled.button`
${tw`bg-gray-400 text-black px-3 py-1 text-lg rounded-lg inline-flex cursor-pointer items-center text-center border border-transparent justify-center`}
  transition: 0.2s background-color ease, 0.2s color ease, 0.2s color ease;
  ${props => (props.shadow ? tw`shadow-xl` : null)}

  ${props => (props.size && props.size === "sm" ? tw`px-2 text-base` : null)}
  ${props => (props.size && props.size === "lg" ? tw`px-5 py-3 text-xl` : null)}
  ${props =>
    props.size && props.size === "xl" ? tw`px-8 py-3 text-2xl` : null}
  ${props => (props.disabled ? tw`bg-gray-200 text-gray-600` : null)}
  ${props => (props.block ? tw`flex w-full` : null)}

${props => (props.danger ? tw`bg-red-500 text-white` : null)}
  ${props => (props.primary ? tw`bg-teal-500 text-white` : null)}
  ${props => (props.link ? tw`bg-transparent text-gray-700 underline` : null)}

${props =>
  props.outline ? tw`border-gray-700 bg-transparent text-gray-700` : null}
  ${props =>
    props.danger && props.outline
      ? tw`text-red-500 bg-transparent border-red-500`
      : null}

  ${props =>
    props.primary && props.outline
      ? tw`text-teal-500 bg-transparent border-teal-500`
      : null}

  ${props => (props.disabled ? tw`opacity-50 cursor-default` : null)}

  svg {
    ${tw`text-2xl`}
  }
`;

const Button = props => {
  let passProps = { ...props };

  const propList = ["primary", "block", "link"];

  propList.map(propName => {
    if (typeof props[propName] !== "undefined") {
      passProps[propName] = "true";
    }
  });

  if (props.icon) {
    passProps.children = (
      <>
        <span css={tw`mr-3`}>{props.icon}</span>{" "}
        <span css={tw`mr-2`}>{props.children}</span>
      </>
    );
  }
  if (props.iconAfter) {
    passProps.children = (
      <>
        <span css={tw`ml-2`}>{props.children}</span>{" "}
        <span css={tw`ml-3`}>{props.iconAfter}</span>
      </>
    );
  }

  return (
    <ButtonStyled as={passProps.tag} {...passProps}>
      {passProps.children}
    </ButtonStyled>
  );
};
export default Button;
