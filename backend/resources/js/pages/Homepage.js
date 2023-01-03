/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useQuery } from 'react-query';
import PostAPI from '../api/PostAPI';
import PostCard from '../components/PostCard';
import { useAppContext } from '../contexts/AppContext';
import PostListSkeleton from '../components/PostListSkeleton';

export default function Homepage() {
  const [page, setPage] = useState(1);
  const { verse } = useAppContext();

  const { isLoading, data } = useQuery(
    ['posts', verse, page],
    () => PostAPI.all(verse, page),
    {
      keepPreviousData: true
    }
  );

  console.log(data);

  if (!verse) return <PostListSkeleton />;

  if (isLoading) return <PostListSkeleton />;

  if (!data) return <PostListSkeleton />;

  if (!Object.keys(data).length > 0) return <PostListSkeleton />;

  return (
    <Flex w="5xl" minW="sm" mx="auto" my={8} gap={8} flexDir="column">
      <Flex flexDir="column" gap={2}>
        {data.data.map((post, i) => (
          <PostCard post={post} key={`post-${i + 1}`} />
        ))}
      </Flex>
      <Flex justifyContent="space-between">
        <Button
          leftIcon={<HiChevronLeft />}
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          isDisabled={!data.prev_page_url}
        >
          Previous
        </Button>
        <Button
          rightIcon={<HiChevronRight />}
          onClick={() => setPage((old) => old + 1)}
          isDisabled={!data.next_page_url}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
}
