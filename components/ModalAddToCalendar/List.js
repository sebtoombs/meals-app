import React from "react";
import tw from "tailwind.macro";
import { css } from "styled-components/macro";
import buildRequestURI from "../../lib/buildRequestURI";
import { Card } from "../Card";
import dynamic from "next/dynamic";
import Button from "../Button";
import useSWR from "swr";
import ListItem, {
  ListItemActions,
  ListItemContent,
  ListItemImage,
  ListItemTitle
} from "../List/ListItem";
import { MdChevronLeft, MdClose, MdAdd } from "react-icons/md";

const Skeleton = dynamic(() => import("react-loading-skeleton"), {
  ssr: false
});

// Pagination: https://codesandbox.io/s/swr-playground-946db
const fetcher = async url => {
  const pageRequest = buildRequestURI(
    url //todo paging
  );
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};

const List = props => {
  const { data, error } = useSWR("meals", fetcher);

  const mealsList = !data ? [null, null, null] : data;

  const mealImage = meal => {
    if (!meal || !meal.image) return null;
    return <span>Todo</span>;
  };

  if (error) {
    return <p>Something went wrong!</p>;
  }

  const selectMeal = meal => {
    return e => {
      props.selectMeal(meal);
    };
  };

  return (
    <div css={tw`p-4`}>
      <div css={tw`pb-4 text-right`}>
        <Button
          link
          icon={<MdClose />}
          onClick={props.closeModal}
          css={tw`ml-auto mr-0`}
        >
          Cancel
        </Button>
      </div>
      {mealsList.map((meal, index) => (
        <div css={tw`mb-3`} key={index}>
          <Card onClick={selectMeal(meal)} as="button" css={tw`block w-full`}>
            <ListItem>
              <ListItemImage>
                {meal ? mealImage(meal) : <Skeleton />}
              </ListItemImage>
              <ListItemContent>
                <ListItemTitle>
                  {meal ? (
                    meal.name
                  ) : (
                    <>
                      <Skeleton height={20} width={200} />
                      <Skeleton height={20} width={100} />
                    </>
                  )}
                </ListItemTitle>
              </ListItemContent>
              <ListItemActions>
                {meal ? (
                  <Button primary tag="span" css={tw`py-3`}>
                    <MdAdd />
                  </Button>
                ) : (
                  <Skeleton width={48} height={40} />
                )}
              </ListItemActions>
            </ListItem>
          </Card>
        </div>
      ))}
    </div>
  );
};
export default List;
