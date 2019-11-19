import styled from "styled-components/macro"
import tw from "tailwind.macro"

import Col from "./Col"

const Row = styled.div`
  ${tw`flex flex-wrap -mx-2`}
  ${props => (props.noGutter ? `${tw`mx-0`} & > ${Col} { ${tw`px-0`} }` : null)}
  ${props => (props.itemsCenter ? tw`items-center` : null)}
`
export default Row
