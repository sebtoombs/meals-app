import React, { useState } from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import { MdRestaurantMenu, MdList } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { useStateValue } from "../lib/state";
import Link from "next/link";
import { withRouter } from "next/router";

const ItemWrapper = styled.span`
  ${tw`block inline-flex flex-column items-center justify-center flex-wrap text-gray-600`}
  svg {
    ${tw`block min-w-full text-2xl`}
  }
  span {
    ${tw`block min-w-full text-sm text-center`}
  }
`;
const NavigationItem = styled.a`
  ${tw`inline-flex cursor-pointer relative items-center justify-center px-4 py-2 border-b-2 border-transparent`} flex: 1;
  min-width: 80px;
  max-width: 168px;

${props => (props.active ? tw`bg-teal-100 border-teal-500` : null)}
  & ${ItemWrapper} {
    ${props => (props.active ? tw`text-teal-500` : null)}
  }
`;

const BottomNavigationStyled = styled.div`
  ${tw`fixed bg-gray-100 w-full flex`} bottom: 0;
  max-width: 28rem;
`;

const getCurrentPath = pathname => {
  pathname = pathname
    .split("/")
    .filter(part => !!part)
    .slice(0, 1);

  return pathname.length ? pathname[0] : "index";
};

const BottomNavigation = props => {
  const { router } = props;

  const path = getCurrentPath(router.pathname);

  //const [{ activePage }, dispatch] = useStateValue();

  /*const setActivePage = page => {
    return () => {
      dispatch({ type: "setActivePage", page });
    };
  };*/

  return (
    <BottomNavigationStyled>
      <Link href={`/`}>
        <NavigationItem active={path === "index"}>
          <ItemWrapper>
            <MdRestaurantMenu />
            <span>Menu</span>
          </ItemWrapper>
        </NavigationItem>
      </Link>
      <Link href={`/meals`}>
        <NavigationItem active={path === "meals"}>
          <ItemWrapper>
            <GiMeal />
            <span>Meals</span>
          </ItemWrapper>
        </NavigationItem>
      </Link>
      <NavigationItem active={path === "shopping"}>
        <ItemWrapper>
          <MdList />
          <span>Shopping</span>
        </ItemWrapper>
      </NavigationItem>
    </BottomNavigationStyled>
  );
};
export default withRouter(BottomNavigation);
