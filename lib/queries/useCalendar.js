import { request, gql } from "graphql-request";
import { useQuery } from "react-query";
import { startOfDay, addDays } from "date-fns";

const endpoint = "http://localhost:3000/api";

export default function useCalendar({
  includeEmpty = false,
  placeholderData = null,
} = {}) {
  return useQuery(
    ["calendar", { includeEmpty }],
    async ({ queryKey }) => {
      const [_key, { includeEmpty }] = queryKey;
      const { calendar } = await request(
        endpoint,
        gql`
          query CalendarQuery($includeEmpty: Boolean) {
            calendar(includeEmpty: $includeEmpty) {
              date
              entries {
                id
                date
                meal {
                  id
                  name
                }
              }
            }
          }
        `,
        { includeEmpty }
      );

      return calendar;
    },
    {
      placeholderData,
    }
  );
}
