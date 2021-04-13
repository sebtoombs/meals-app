import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "http://localhost:3000/api";

export default function useMeal(mealId) {
  return useQuery(
    ["meal", { mealId }],
    async ({ queryKey }) => {
      const [_key, { mealId }] = queryKey;
      const { meal } = await request(
        endpoint,
        gql`
          query MealQuery($mealId: Int!) {
            meal(mealId: $mealId) {
              id
              name
              description
            }
          }
        `,
        { mealId }
      );
      return meal;
    },
    { enabled: mealId !== null && mealId !== undefined }
  );
}
