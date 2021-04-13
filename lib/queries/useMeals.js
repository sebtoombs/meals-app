import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "http://localhost:3000/api";

export default function useMeals({ placeholderData = null } = {}) {
  if (placeholderData === null) {
    placeholderData = [
      {
        id: 0,
      },
      {
        id: 0,
      },
      {
        id: 0,
      },
    ];
  }

  return useQuery(
    "meals",
    async () => {
      const { meals } = await request(
        endpoint,
        gql`
          query {
            meals {
              id
              name
              description
            }
          }
        `
      );
      return meals;
    },
    {
      placeholderData,
    }
  );
}
