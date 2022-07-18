/* eslint-disable no-nested-ternary */
import { Flex, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import PostAPI from '../api/PostAPI';
import PostAnswerCard from '../components/PostAnswerCard';
import PostCard from '../components/PostCard';
import PostNotFound from '../components/PostNotFound';
import { useAppContext } from '../contexts/AppContext';

export default function DetailPost() {
  const { id } = useParams();
  const { verse } = useAppContext();

  const { isLoading, data } = useQuery(
    ['detail-post', verse, id],
    () => PostAPI.show(verse, id)
  );

  console.log(data);

  return isLoading ? (
    <Spinner />
  ) : data.error ? (
    <PostNotFound />
  ) : (
    <Flex
      w="5xl"
      minW="sm"
      mx="auto"
      my={8}
      gap={8}
      flexDir="column"
      alignItems="flex-end"
    >
      <PostCard post={data.post} isDetailPage />
      <Flex w="80%" gap={8} flexDir="column">
        {data.postAnswers.map((answer) => (
          <PostAnswerCard post={answer} isDetailPage />
        ))}
      </Flex>
    </Flex>
  );
}
