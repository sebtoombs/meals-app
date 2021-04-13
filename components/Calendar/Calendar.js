import { useState } from "react";
import useCalendar from "../../lib/queries/useCalendar";
import { Global } from "@emotion/react";
import {
  Container,
  Heading,
  VStack,
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Wrap,
  WrapItem,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  forwardRef,
  HStack,
  Skeleton,
  Flex,
  Portal,
  Icon,
  Grid,
  AspectRatio,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { AddEntry } from "../AddEntry";
import CalendarCard, {
  CalendarCardTitle,
  CalendarCardHeader,
  CalendarCardBody,
} from "../CalendarCard";
import { addDays, isSameDay, startOfDay, format, parseISO } from "date-fns";
import { ViewMeal } from "../ViewMeal";
import MealEntry from "./MealEntry";

function useDisclosureWithState() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState();
  return {
    isOpen,
    state,
    onOpen: (newState) => {
      if (
        newState &&
        ["String", "Boolean", "Array", "Number", "Object"].indexOf(
          newState.constructor.name
        ) === -1
      ) {
        newState = undefined;
      }
      setState(newState);
      onOpen();
    },
    onClose: () => {
      setState();
      onClose();
    },
  };
}

export function Calendar() {
  // Access the client
  //const queryClient = useQueryClient();

  // Queries
  const calendar = useCalendar({ includeEmpty: true });

  // Add entry
  const addEntryView = useDisclosureWithState(); // {isOpen, onOpen, onClose}

  // View meal
  const viewMealView = useDisclosureWithState();

  return (
    <CalendarView
      calendar={calendar}
      addEntryView={addEntryView}
      viewMealView={viewMealView}
    />
  );
}

export function CalendarView({ calendar, addEntryView, viewMealView }) {
  const renderView = () => {
    if (
      calendar.status === "loading" ||
      (calendar.status === "success" && calendar?.data?.length)
    )
      return CalendarListView({
        dayEntries: calendar.data,
        addEntryView,
        status: calendar.status,
        viewMealView,
      });
    else if (calendar.status === "success" && !calendar?.data?.length)
      return CalendarEmptyView({ addEntryView });

    return <CalendarErrorView />;
  };

  return (
    <>
      {renderView()}
      <AddEntry addEntryView={addEntryView} />
      <ViewMeal viewMealView={viewMealView} />
    </>
  );
}

export function CalendarErrorView() {
  return <p>Oh no I haven't built this view!</p>;
}

export function CalendarListView({
  dayEntries = [],
  status = "loading",
  addEntryView,
  viewMealView,
}) {
  const todayDate = startOfDay(new Date());
  const tomorrowDate = addDays(todayDate, 1);
  const entryDateToTitle = (dateISOString, index) => {
    const date = parseISO(dateISOString);
    if (isSameDay(date, todayDate)) return "Today";
    if (isSameDay(date, tomorrowDate)) return "Tomorrow";
    const dayOfWeek = format(date, "EEEE");
    if (index > 6) return `Next ${dayOfWeek}`;
    return dayOfWeek;
  };

  return (
    <>
      <Global
        styles={(theme) => ({
          body: {
            background: theme.colors.gray["50"],
          },
        })}
      />
      <Box p="4">
        <VStack spacing="4">
          {status === "loading" ? (
            <Skeleton width="100%" height="40px" />
          ) : (
            dayEntries?.map((dayEntry, index) => (
              <CalendarCard
                key={index}
                bg={index === 0 ? "blue.100" : "white"}
                border="1px solid"
                borderColor={index === 0 ? "blue.300" : "gray.100"}
              >
                <CalendarCardHeader>
                  <CalendarCardTitle>
                    {entryDateToTitle(dayEntry.date, index)}
                  </CalendarCardTitle>
                </CalendarCardHeader>

                {dayEntry.entries.length ? (
                  dayEntry.entries.length === 1 ? (
                    <Box px="4" pb="4">
                      <MealEntry
                        entry={dayEntry.entries[0]}
                        onClick={() => {
                          viewMealView.onOpen({
                            mealId: dayEntry.entries[0].meal.id,
                            id: dayEntry.entries[0].id,
                          });
                        }}
                      />
                    </Box>
                  ) : (
                    <Grid
                      sx={{
                        "--gutter": "var(--chakra-sizes-4)",
                        scrollSnapType: "x proximity",
                        "&:before,&:after": {
                          content: '""',
                          width: "4",
                        },
                        gridGap: "calc(var(--gutter) / 2)",
                        gridTemplateColumns: "10px",
                        gridTemplateRows: "minmax(100%, 1fr)",
                        gridAutoFlow: "column",
                        gridAutoColumns: `calc(${
                          dayEntry.entries.length === 2 ? "75%" : "50%"
                        } - var(--gutter) * 2)`,
                        overflowX: "scroll",
                        paddingBottom: "calc(.75 * var(--gutter))",
                        marginBottom: "calc(-.25 * var(--gutter))",
                        scrollbarWidth: "none",
                        marginBottom: 0,
                        pt: "4px",
                        pb: "4",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      }}
                    >
                      {dayEntry.entries.map((entry, index) => (
                        <Box key={index}>
                          <MealEntry
                            entry={entry}
                            bg={
                              dayEntry.entries.length > 1 ? "gray.50" : "white"
                            }
                            onClick={() => {
                              viewMealView.onOpen({
                                mealId: entry.meal.id,
                                id: entry.id,
                              });
                            }}
                          />
                        </Box>
                      ))}
                    </Grid>
                  )
                ) : (
                  <Flex p="4" justifyContent="center">
                    <Button
                      colorScheme="teal"
                      size="sm"
                      leftIcon={<MdAdd />}
                      onClick={() => addEntryView.onOpen(dayEntry.date)}
                    >
                      Add
                    </Button>
                  </Flex>
                )}
              </CalendarCard>
            ))
          )}
        </VStack>
      </Box>
      <Portal>
        <Box position="fixed" right="2" bottom="20">
          <Button
            rounded="full"
            colorScheme="teal"
            display="flex"
            w="14"
            h="14"
            shadow="lg"
            alignItems="center"
            justifyContent="center"
            onClick={addEntryView.onOpen}
          >
            <Box as="span">
              <Icon as={MdAdd} fontSize="2xl" />
              <Text fontSize="xs">Add</Text>
            </Box>
          </Button>
        </Box>
      </Portal>
    </>
  );
}

export function CalendarEmptyView({ addEntryView }) {
  return (
    <Container>
      <VStack py={[10, null, 20]} spacing={8}>
        <Heading>Meals</Heading>
        <Text>There's nothing on your menu yet</Text>
        <Button
          colorScheme="teal"
          leftIcon={<MdAdd />}
          onClick={addEntryView.onOpen}
        >
          Add a meal
        </Button>
      </VStack>
    </Container>
  );
}
