import React from 'react';
import {
  Flex,
  Heading,
  Link,
  SkeletonText,
  Text
} from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import PostAPI from '../api/PostAPI';

export default function RelatedPosts({ postId, verse }) {
  const { isLoading, data } = useQuery(
    ['getRelatedPosts', postId],
    () => PostAPI.getRelatedPosts(postId)
  );

  if (isLoading) {
    return (
      <Flex
        background="white"
        boxShadow="xl"
        borderRadius="md"
        flexDir="column"
        p={5}
        height="fit-content"
        w="xl"
      >
        <SkeletonText noOfLines={4} spacing={4} />
      </Flex>
    );
  }

  if (
    !data?.success ||
    !data?.relatedPosts ||
    data?.relatedPosts.length == 0
  ) {
    return (
      <Flex
        w="xl"
        borderColor="purple.400"
        borderWidth="1px"
        height="fit-content"
        flexDir="column"
        p={4}
        gap={3}
      >
        <Heading size="md">Bài viết liên quan</Heading>
        <Text>Không có bài viết liên quan nào.</Text>
      </Flex>
    );
  }

  return (
    <Flex
      w="xl"
      borderColor="purple.400"
      borderWidth="1px"
      height="fit-content"
      flexDir="column"
      p={4}
      gap={3}
    >
      <Heading size="md">Bài viết liên quan</Heading>
      <Flex flexDir="column" gap={2}>
        {data.relatedPosts.map(({ id, title, score }) => (
          <RouteLink
            to={`/posts/${verse}/${id}`}
            key={`${verse}${id}`}
          >
            <Flex gap={2}>
              <Text
                height="2rem"
                lineHeight="2rem"
                textAlign="center"
                w="3rem"
                backgroundColor="purple.400"
                color="white"
              >
                {score}
              </Text>
              <Text noOfLines={1} py={1}>
                {title}
              </Text>
            </Flex>
          </RouteLink>
        ))}
      </Flex>
    </Flex>
  );
}
