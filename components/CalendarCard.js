import { Box, Text } from "@chakra-ui/layout";
import { forwardRef } from "react";

const CalendarCard = forwardRef(function CalendarCard(
  { children, ...props },
  ref
) {
  return (
    <Box
      bg="white"
      rounded="md"
      overflow="hidden"
      width="sm"
      maxW="100%"
      {...props}
      ref={ref}
    >
      {children}
    </Box>
  );
});

export default CalendarCard;

export const CalendarCardHeader = forwardRef(function CalendarCardHeader(
  { children, ...props },
  ref
) {
  return (
    <Box px="4" py="2" {...props} ref={ref}>
      {children}
    </Box>
  );
});

export const CalendarCardTitle = forwardRef(function CalendarCardTitle(
  { children, ...props },
  ref
) {
  return (
    <Text as="span" fontSize="xl" {...props} ref={ref}>
      {children}
    </Text>
  );
});

export const CalendarCardBody = forwardRef(function CalendarCardBody(
  { children, ...props },
  ref
) {
  return (
    <Box px="4" py="2" {...props} ref={ref}>
      {children}
    </Box>
  );
});
