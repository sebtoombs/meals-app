import fetch from "isomorphic-unfetch";
import Link from "next/link";
import tw from "tailwind.macro";
import styled from "styled-components/macro";
import { Card } from "../../components/Card";
import ListItem, {
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemActions
} from "../../components/List/ListItem";
import Button from "../../components/Button";
import { MdClose, MdAdd } from "react-icons/md";
import FAB from "../../components/FAB";
import ClientOnlyPortal from "../../components/ClientOnlyPortal";
import modalService from "../../lib/modalService";

MealsPage.getInitialProps = async ({ req, query }) => {
  /*const protocol = req
    ? `${req.headers["x-forwarded-proto"]}:`
    : location.protocol;
  const host = req ? req.headers["x-forwarded-host"] : location.host;
  const pageRequest = `${protocol}//${host}/api/profiles?page=${query.page ||
    1}&limit=${query.limit || 9}`;*/
  const pageRequest = `http://localhost:3000/api/meals?page=${query.page ||
    1}&limit=${query.limit || 9}`;
  const res = await fetch(pageRequest);
  const json = await res.json();
  return { meals: json, page: 1, pageCount: 1 };
};

const MealsPageStyled = styled.div`
  ${tw`bg-gray-100`}
`;

function MealsPage({ meals, page, pageCount }) {
  const handleAddMeal = () => {
    console.log("add new meal");
    modalService.emit("modal::add_meal::open");
  };

  return (
    <MealsPageStyled>
      <div css={tw`px-2 py-8`}>
        {meals.map((meal, index) => (
          <div css={tw`mb-3`} key={index}>
            <Link href="/meals/[id]" as={`/meals/${meal.pk}`}>
              <Card>
                <ListItem>
                  <ListItemImage />
                  <ListItemContent>
                    <ListItemTitle>{meal.name}</ListItemTitle>
                  </ListItemContent>
                  {/*<ListItemActions>
                    <Button danger outline size="sm" tag="span" css={tw`py-2`}>
                      <MdClose />
                    </Button>
                  </ListItemActions>*/}
                </ListItem>
              </Card>
            </Link>
          </div>
        ))}

        <nav>
          {page > 1 && (
            <Link href={`/meals?page=${page - 1}&limit=9`}>
              <a>Previous</a>
            </Link>
          )}
          {page < pageCount && (
            <Link href={`/meals?page=${page + 1}&limit=9`}>
              <a className="next">Next</a>
            </Link>
          )}
        </nav>
      </div>
      <ClientOnlyPortal>
        <FAB onClick={handleAddMeal}>
          <MdAdd />
        </FAB>
      </ClientOnlyPortal>
    </MealsPageStyled>
  );
}

export default MealsPage;
