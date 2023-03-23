/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Image,
  SkeletonText,
  Text,
  Textarea,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import {
  HiChevronDown,
  HiChevronUp,
  HiFlag,
  HiPencil
} from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import Zoom from 'react-medium-image-zoom';
import { useNavigate } from 'react-router-dom';
import PostAPI from '../api/PostAPI';
import Comment from './Comment';
import { useUserAuth } from '../contexts/UserAuthContext';
import CommentAPI from '../api/CommentAPI';
import { getImagePath } from '../helper/helper';
import 'react-medium-image-zoom/dist/styles.css';
import PostFormDrawer from './PostFormDrawer';
import ReportModal from './ReportModal';

export default function DetailPostCard({ verse, postId }) {
  const [isOpenCommentInput, setIsOpenCommentInput] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const { authenticated, currentUser } = useUserAuth();
  const toast = useToast();
  const history = useNavigate();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const togglePostForm = useCallback(() => {
    setIsPostFormOpen((prev) => !prev);
  }, []);

  const toggleReportModal = useCallback(() => {
    setIsReportModalOpen((prev) => !prev);
  }, []);

  const { register, handleSubmit, reset } = useForm();

  const { isLoading, data, refetch } = useQuery(
    ['detail-post', verse, postId],
    () => PostAPI.show(verse, postId)
  );

  const handleUpvote = useCallback(
    (id) => {
      if (authenticated) {
        PostAPI.upvote({ postId: id }).then((response) => {
          if (response.success) {
            refetch();
          } else {
            toast({
              title: response.message,
              duration: 3000,
              status: 'error',
              position: 'top'
            });
          }
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
    [authenticated, refetch, toast]
  );

  const handleDownvote = useCallback(
    (id) => {
      if (authenticated) {
        PostAPI.downvote({ postId: id }).then((response) => {
          if (response.success) {
            refetch();
          } else {
            toast({
              title: response.message,
              duration: 3000,
              status: 'error',
              position: 'top'
            });
          }
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
    [authenticated, refetch, toast]
  );

  const handleComment = useCallback(
    ({ comment }) => {
      if (authenticated) {
        setIsCommenting(true);
        CommentAPI.comment({
          postId: data?.post?.id,
          body: comment
        })
          .then((response) => {
            setIsCommenting(false);
            toast({
              title: response.message,
              duration: 3000,
              status: response.success ? 'success' : 'error'
            });
            reset();
            refetch();
            setIsOpenCommentInput(false);
          })
          .catch(() => {
            setIsCommenting(false);
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
    [authenticated, data?.post?.id, refetch, reset, toast]
  );

  if (isLoading)
    return (
      <Flex
        background="white"
        boxShadow="xl"
        borderRadius="md"
        flexDir="column"
        p={5}
      >
        <SkeletonText noOfLines={6} spacing={8} />
      </Flex>
    );

  if (!isLoading && !data?.success) {
    return null;
  }

  return (
    <Flex
      background="white"
      boxShadow="xl"
      borderRadius="md"
      flexDir="column"
    >
      <Flex
        p={4}
        borderBottomWidth={1}
        borderColor="gray.200"
        flexDir="column"
        position="relative"
      >
        {currentUser?.id === data?.post?.user_id && (
          <>
            <PostFormDrawer
              isOpen={isPostFormOpen}
              onClose={togglePostForm}
              postData={data.post}
              refetch={refetch}
            />
            <Box position="absolute" top={2} right={2}>
              <IconButton
                onClick={togglePostForm}
                icon={<HiPencil fontSize="1.5rem" />}
                variant="ghost"
                size="lg"
              />
            </Box>
          </>
        )}
        <Text fontSize="3xl" fontWeight={500}>
          {data.post.title}
        </Text>
        <Flex alignItems="center" gap={2}>
          <Text color="gray.500">
            Đã hỏi {moment(new Date(data.post.created_at)).fromNow()}
          </Text>
          <Badge bg="purple.400" color="white">
            {verse}
          </Badge>
        </Flex>
      </Flex>
      <Flex p={4} gap={4}>
        <Flex flexDir="column" alignItems="center" w="90px">
          <IconButton
            onClick={() => handleUpvote(data.post.id)}
            icon={
              <Icon
                as={HiChevronUp}
                w={10}
                h={10}
                color={
                  data.post.isUpvoted ? 'purple.500' : 'gray.300'
                }
              />
            }
            size="lg"
            background="none"
            w="75px"
            _hover={{ background: 'none' }}
            _focus={{ border: 'none' }}
          />
          <Text
            fontSize="2xl"
            fontWeight="600"
            color={
              data.post.isUpvoted || data.post.isDownvoted
                ? 'gray.600'
                : 'gray.500'
            }
          >
            {data.post.score}
          </Text>
          <IconButton
            onClick={() => handleDownvote(data.post.id)}
            icon={
              <Icon
                as={HiChevronDown}
                w={10}
                h={10}
                color={
                  data.post.isDownvoted ? 'purple.500' : 'gray.300'
                }
              />
            }
            size="lg"
            background="none"
            w="75px"
            _hover={{ background: 'none' }}
            _focus={{ border: 'none' }}
          />
          {authenticated && currentUser?.id !== data?.post?.user_id && (
            <>
              <ReportModal
                isOpen={isReportModalOpen}
                onClose={toggleReportModal}
                postId={postId}
              />
              <Tooltip label="Báo cáo bài đăng này">
                <IconButton
                  icon={<HiFlag fontSize="1.5rem" />}
                  onClick={toggleReportModal}
                />
              </Tooltip>
            </>
          )}
        </Flex>
        <Flex flexDir="column" w="full">
          <Flex
            flexDir="column"
            gap={4}
            pb={4}
            borderBottomWidth={1}
            borderColor="gray.200"
          >
            <Text whiteSpace="pre-wrap">{data.post.body}</Text>
            <Flex gap={2}>
              {data.post.tags.map((tag) => (
                <Badge key={`tag-${tag.name}`}>{tag.name}</Badge>
              ))}
            </Flex>
            {data.post?.images.length > 0 && (
              <Flex gap={2} my={2}>
                {data.post?.images.map((image, i) => (
                  <Zoom key={`detail-card-zoom-${i + 1}`}>
                    <Image
                      boxSize="100px"
                      objectFit="cover"
                      src={getImagePath(image.name)}
                    />
                  </Zoom>
                ))}
              </Flex>
            )}
            <Flex justifyContent="flex-end">
              <Flex
                flexDir="column"
                backgroundColor="purple.200"
                p={2}
                borderRadius="md"
                alignItems="flex-start"
              >
                <Text color="gray.700">
                  Đã hỏi vào{' '}
                  {moment(new Date(data.post.created_at)).format(
                    'lll'
                  )}
                </Text>
                <Button
                  variant="link"
                  fontWeight={500}
                  onClick={() =>
                    history(`/profile/${data.post.user.id}`)
                  }
                >
                  {data.post.user.display_name}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir="column" alignItems="flex-start">
            {data.post.comments.map((comment, i) => (
              <Comment
                key={`comment-${i + 1}-${comment.body}`}
                body={comment.body}
                author={comment.user}
                createdAt={comment.created_at}
              />
            ))}
            <Box w="full">
              <Collapse
                in={isOpenCommentInput}
                animateOpacity
                w="full"
                style={{ overflow: 'inherit' }}
              >
                <Flex
                  w="full"
                  gap={2}
                  mt={4}
                  as="form"
                  onSubmit={handleSubmit(handleComment)}
                >
                  <Textarea
                    {...register('comment', { required: true })}
                    focusBorderColor="purple.500"
                  />
                  <Button
                    type="submit"
                    colorScheme="purple"
                    isLoading={isCommenting}
                  >
                    Thêm bình luận
                  </Button>
                </Flex>
              </Collapse>
            </Box>
            {!isOpenCommentInput ? (
              <Button
                variant="link"
                mt={4}
                onClick={() => setIsOpenCommentInput((prev) => !prev)}
              >
                Thêm bình luận
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
