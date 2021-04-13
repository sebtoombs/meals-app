import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AspectRatio,
  Box,
  VStack,
} from "@chakra-ui/react";
import useMeal from "../../lib/queries/useMeal";
import useRemoveCalendarEntry from "../../lib/mutations/useRemoveCalendarEntry";

export function ViewMeal({ viewMealView }) {
  // const [meal, setMeal] = useState();

  const meal = useMeal(viewMealView.state?.mealId);

  const removeCalendarEntry = useRemoveCalendarEntry();

  const onRemoveEntry = async (e) => {
    e.preventDefault();

    try {
      await removeCalendarEntry.mutateAsync({
        id: viewMealView.state?.id,
      });

      viewMealView.onClose();
    } catch (error) {
      console.error(error);
      // TODO handle error
    }
  };

  return (
    <ViewMealView
      {...viewMealView}
      {...{ meal }}
      onRemoveEntry={onRemoveEntry}
    />
  );
}

export function ViewMealView({ isOpen, onOpen, onClose, meal, onRemoveEntry }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader>{meal?.data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="4" sx={{ "&>*": { minW: "100%" } }}>
            {/* TODO image goes here */}
            <AspectRatio ratio={16 / 9}>
              <Box bg="gray.200" />
            </AspectRatio>
            <Box>{meal?.data?.description}</Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" variant="outline" onClick={onRemoveEntry}>
            Remove
          </Button>
          <Button ml={"auto"} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
