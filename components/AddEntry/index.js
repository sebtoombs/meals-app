import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Flex,
  Box,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { DayPicker } from "../DayPicker";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import useMeals from "../../lib/queries/useMeals";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdAdd } from "react-icons/md";
import useAddCalendarEntry from "../../lib/mutations/useAddCalendarEntry";
import { format, parse } from "date-fns";

export function AddEntry({ addEntryView }) {
  const [meal, setMeal] = useState();
  const [date, setDate] = useState(addEntryView.state || null);

  useEffect(() => {
    setDate(addEntryView.state);
  }, [addEntryView.state]);

  const addCalendarEntry = useAddCalendarEntry();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCalendarEntry.mutateAsync({
        mealId: meal.id,
        date,
      });

      addEntryView.onClose();
    } catch (error) {
      console.error(error);
      // TODO handle error
    }
  };

  useEffect(() => {
    if (!addEntryView.isOpen && meal) setMeal(null);
    if (!addEntryView.isOpen && date) setDate(null);
  }, [addEntryView.isOpen]);

  return (
    <AddEntryView
      {...addEntryView}
      {...{ meal, setMeal, date, setDate }}
      onSubmit={onSubmit}
    />
  );
}

export function AddEntryView({
  isOpen,
  onOpen,
  onClose,
  onSubmit,
  meal,
  setMeal,
  date,
  setDate,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit} bg="gray.100">
        <ModalHeader>Add Meal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!meal && <AddEntryMealList {...{ meal, setMeal }} />}
          {!!meal && (
            <DayPicker
              name={"date"}
              value={date}
              onChange={(dateString) => {
                setDate(parse(dateString, "yyyy-MM-dd", new Date()));
              }}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          {!!meal && (
            <Button
              colorScheme="teal"
              type="submit"
              isDisabled={!meal || !date}
            >
              Add to Calendar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function AddEntryMealList({ meal, setMeal }) {
  // Filter/search state will go here

  const mealOptions = useMeals();

  if (
    mealOptions.status === "loading" ||
    (mealOptions.status === "success" && mealOptions.data.length)
  )
    return (
      <AddEntryMealListView mealOptions={mealOptions} {...{ meal, setMeal }} />
    );
  else if (mealOptions.status === "success" && !mealOptions.data.length)
    return <AddEntryMealListEmptyView />;

  return <AddEntryMealListErrorView meals={mealOptions} />;
}

export function AddEntryMealListView({ mealOptions, meal, setMeal }) {
  return (
    <VStack spacing="4" sx={{ "&>*": { minWidth: "100%" } }}>
      {mealOptions?.data?.map((meal, index) => (
        <Box
          as="button"
          overflow="hidden"
          rounded="md"
          bg="white"
          key={index}
          textAlign="left"
          _focus={{
            shadow: "outline",
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
          onClick={() => (meal.id ? setMeal(meal) : null)}
          disabled={!meal.id}
        >
          <Flex>
            {/* TODO image goes here */}
            <Box bg="gray.300" w="12" />

            {meal.id ? (
              <Flex
                flexGrow="1"
                p="2"
                flexDir="column"
                justifyContent="center"
                fontWeight="medium"
              >
                {meal.name}
              </Flex>
            ) : (
              <Box flexGrow="1">
                <Skeleton width="100%" height="100%" />
              </Box>
            )}
            <Flex p="2" flexDir="column" justifyContent="center">
              <Box
                as="span"
                rounded="md"
                bg="teal.500"
                color="white"
                w="8"
                h="8"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
              >
                <MdAdd />
              </Box>
            </Flex>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
}

export function AddEntryMealListEmptyView() {
  return (
    <Flex justifyContent="center">
      <Text>No meals to select.</Text>
    </Flex>
  );
}

export function AddEntryMealListErrorView({ meals }) {
  return (
    <Flex justifyContent="center">
      <Text>Something went wrong.</Text>
    </Flex>
  );
}
