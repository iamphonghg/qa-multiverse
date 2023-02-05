/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PostAPI from '../api/PostAPI';
import DetailPostCard from '../components/DetailPostCard';
import NotFound from './NotFound';
import PostAnswerCard from '../components/PostAnswerCard';
import { useUserAuth } from '../contexts/UserAuthContext';
import RelatedPosts from '../components/RelatedPosts';

export default function DetailPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const { verse, id } = useParams();
  const { authenticated } = useUserAuth();
  const { register, handleSubmit, reset } = useForm();
  const { isLoading, data, refetch } = useQuery(
    ['getPostAnswersIds', verse, id],
    () => PostAPI.getPostAnswersIds(verse, id)
  );

  const handleAnswer = useCallback(
    ({ answer }) => {
      if (authenticated) {
        setIsSubmitting(true);
        PostAPI.create({
          verse: verse,
          body: answer,
          parentId: id
        })
          .then((response) => {
            setIsSubmitting(false);
            toast({
              title: response.message,
              duration: 3000,
              status: response.success ? 'success' : 'error'
            });
            reset();
            refetch();
          })
          .catch(() => {
            setIsSubmitting(false);
            toast({
              title: 'Lỗi không xác định',
              duration: 3000,
              status: 'error'
            });
          });
      } else {
        toast({
          title: 'Vui lòng đăng nhập để sử dụng',
          duration: 3000,
          status: 'warning',
          position: 'top'
        });
      }
    },
    [authenticated, id, refetch, reset, toast, verse]
  );

  if (isLoading) return null;

  if (!isLoading && !data?.success) return <NotFound />;

  return (
    <Flex gap={8} my={8} justifyContent="center">
      <Flex w="5xl" minW="sm" gap={8} flexDir="column">
        <DetailPostCard verse={verse} postId={id} />
        <Flex
          background="white"
          boxShadow="xl"
          borderRadius="md"
          flexDir="column"
        >
          <Box p={4}>
            <Text fontWeight={500} fontSize="2xl" mb={2}>
              {data.postAnswersIds.length} câu trả lời
            </Text>
          </Box>
          {data.postAnswersIds.map((postAnswerId, i) => (
            <PostAnswerCard
              key={`postanswer-${i + 1}`}
              verse={verse}
              postId={postAnswerId}
              parentAuthorId={data.authorId}
            />
          ))}
          <Flex
            p={4}
            flexDir="column"
            gap={4}
            as="form"
            onSubmit={handleSubmit(handleAnswer)}
          >
            <Text fontWeight={500} fontSize="2xl">
              Câu trả lời của bạn
            </Text>
            <Textarea
              {...register('answer', { required: true })}
              rows={6}
              focusBorderColor="purple.500"
            />
            <Button
              type="submit"
              w="200px"
              colorScheme="purple"
              isLoading={isSubmitting}
            >
              Trả lời
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <RelatedPosts postId={id} verse={verse} />
    </Flex>
  );
}
