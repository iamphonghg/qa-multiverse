/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useQuery } from 'react-query';
import PostAPI from '../api/PostAPI';
import PostCard from '../components/PostCard';
import { useAppContext } from '../contexts/AppContext';

export default function Homepage() {
  const [page, setPage] = useState(1);
  const { verse } = useAppContext();

  const { isLoading, isError, error, data } = useQuery(
    ['posts', verse, page],
    () => PostAPI.all(verse, page),
    {
      keepPreviousData: true
    }
  );

  console.log(data);

  // eslint-disable-next-line no-nested-ternary
  return (isLoading || !verse) && (!data || !Array.isArray(data)) ? (
    <Spinner />
  ) : (
    <Flex w="5xl" minW="sm" mx="auto" my={8} gap={8} flexDir="column">
      <Flex maxW="40rem" flexDir="column" gap={2}>
        {data.data.map((post, i) => (
          <PostCard post={post} key={`post-${i + 1}`} />
        ))}
      </Flex>
      <Flex maxW="40rem" justifyContent="space-between">
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
