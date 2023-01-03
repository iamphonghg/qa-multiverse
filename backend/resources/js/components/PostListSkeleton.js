import React from 'react';
import { Box, Flex, SkeletonText } from '@chakra-ui/react';

export default function PostListSkeleton() {
  return (
    <Flex w="5xl" minW="sm" mx="auto" my={8} gap={8} flexDir="column">
      <Flex flexDir="column" gap={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
          <Box
            key={`skeleton-${i + 1}`}
            p={6}
            backgroundColor="white"
            borderRadius="md"
            boxShadow="xl"
          >
            <SkeletonText noOfLines={2} spacing={4} />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
}
