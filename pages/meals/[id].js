import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStateValue } from "../../lib/state";

MealPage.getInitialProps = async ({ req, query }) => {
  /*const protocol = req
    ? `${req.headers["x-forwarded-proto"]}:`
    : location.protocol;
  const host = req ? req.headers["x-forwarded-host"] : location.host;*/
  //const pageRequest = `${protocol}//${host}/api/profiles/${query.id}`;
  const pageRequest = `http://localhost:3000/api/meals/${query.id}`;
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};

function MealPage({ meal }) {
  const [{ lastPath }] = useStateValue();

  return (
    <>
      <div>
        <h1>{meal.name}</h1>
        <p>{meal.name_extra}</p>
        <Link href={lastPath === "/" ? "/" : "/meals"}>
          <a>← Back to {lastPath === "/" ? "menu" : "meals"}</a>
        </Link>
      </div>
    </>
  );
}

export default MealPage;
