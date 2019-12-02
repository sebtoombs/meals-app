import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStateValue } from "../../lib/state";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import Button from "../../components/Button";
import { MdArrowBack, MdEdit } from "react-icons/md";

MealPage.getInitialProps = async ({ req, query }) => {
  /*const protocol = req
    ? `${req.headers["x-forwarded-proto"]}:`
    : location.protocol;
  const host = req ? req.headers["x-forwarded-host"] : location.host;*/
  //const pageRequest = `${protocol}//${host}/api/profiles/${query.id}`;

  const pageRequest = `http://localhost:3000/api/meals/${query.id}`;
  const res = await fetch(pageRequest);
  const json = await res.json();
  return { meal: json };
};

function MealPage({ meal }) {
  console.log(meal);
  const [{ lastPath }] = useStateValue();

  return (
    <>
      <div css={tw`px-8 py-4`}>
        <div css={tw`pb-4 flex items-center justify-between`}>
          <Button outline primary icon={<MdEdit />}>
            Edit
          </Button>
          <Link href={lastPath === "/" ? "/" : "/meals"}>
            <a
              css={tw`text-gray-700 flex items-center text-lg cursor-pointer underline`}
            >
              <MdArrowBack css={tw`text-2xl mr-3`} /> Back to{" "}
              {lastPath === "/" ? "menu" : "meals"}
            </a>
          </Link>
        </div>

        <div
          css={`
            ${tw`bg-gray-300 rounded mb-5`} padding-bottom: 56%;
          `}
        ></div>

        <h1 css={tw`text-2xl`}>{meal.name}</h1>
        <p css={tw`text-lg text-gray-700 ml-3`}>{meal.name_extra}</p>
      </div>
    </>
  );
}

export default MealPage;
