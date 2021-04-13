import { Box, AspectRatio, Text } from "@chakra-ui/react";

export default function MealEntry({ entry, ...props }) {
  return (
    <Box
      rounded="md"
      overflow="hidden"
      as="button"
      cursor="pointer"
      textAlign="left"
      w="100%"
      _focus={{
        boxShadow: "outline",
        outlineOffset: "2px",
        outline: "2px transparent",
      }}
      bg="white"
      {...props}
    >
      {/* TODO image goes here */}
      <AspectRatio ratio={16 / 7}>
        <Box bg="gray.100" />
      </AspectRatio>
      <Text fontWeight="medium" p="4">
        {entry?.meal?.name}
      </Text>
    </Box>
  );
}
