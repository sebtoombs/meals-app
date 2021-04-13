import { request, gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";

const endpoint = "/api";

export default function useAddCalendarEntry() {
  const queryClient = useQueryClient();

  return useMutation(
    "addCalendarEntry",
    async ({ mealId, date }) => {
      // Send the date as just YYYY-MM-DD in local date
      // date = formatISO(date).split("T")[0];
      date = format(date, "yyyy-MM-dd");

      const { addCalendarEntry } = await request(
        endpoint,
        gql`
          mutation {
            addCalendarEntry(mealId: ${mealId}, date: "${date}") {
              id
              date
              meal {
                id
                name
              }
            }
          }
        `
      );
      return addCalendarEntry;
    },
    {
      // Optimistically update the cache value on mutate, but store
      // the old value and return it so that it's accessible in case of
      // an error
      onMutate: async (entry) => {
        await queryClient.cancelQueries("calendar");

        const previousValue = queryClient.getQueryData("calendar");

        queryClient.setQueryData("calendar", (old) => ({
          ...old,
          entry,
        }));

        return previousValue;
      },
      // On failure, roll back to the previous value
      onError: (err, variables, previousValue) =>
        queryClient.setQueryData("calendar", previousValue),
      // After success or failure, refetch the todos query
      onSuccess: () => {
        queryClient.invalidateQueries("calendar");
      },
    }
  );
}
