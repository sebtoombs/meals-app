import tw from "tailwind.macro";
import styled from "styled-components/macro";

const ListItem = styled.div`
  ${tw`flex cursor-pointer`}
`;
export default ListItem;

const ListItemImage = styled.div`
  ${tw`bg-gray-300 w-20 h-20 overflow-hidden`} flex-grow: 0;
  min-width: 5rem;
  & > span {
    ${tw`w-full h-full block`}
    & > span {
      ${tw`w-full h-full block`}
    }
  }
`;
export { ListItemImage };

const ListItemContent = styled.div`
  ${tw`px-3 py-2 text-left`} flex-grow: 1;
`;
export { ListItemContent };

const ListItemActions = styled.div`
  ${tw`pr-3 py-2 self-center w-20 flex justify-center`} flex-grow: 0;
  min-width: 5rem;
`;
export { ListItemActions };

const ListItemTitle = styled.span`
  ${tw`block font-bold text-lg`}
`;
export { ListItemTitle };
