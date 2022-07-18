import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

export default function FullPageSpinner() {
  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="darkBlue"
        size="xl"
      />
    </Flex>
  );
}
