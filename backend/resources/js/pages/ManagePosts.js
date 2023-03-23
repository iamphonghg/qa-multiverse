import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineEye,
  HiPencil
} from 'react-icons/hi';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import PostAPI from '../api/PostAPI';
import PostFormDrawer from '../components/PostFormDrawer';

export default function ManagePosts() {
  const [page, setPage] = useState(1);
  const history = useNavigate();
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const togglePostForm = useCallback(() => {
    setIsPostFormOpen((prev) => !prev);
  }, []);

  const { isLoading, data: postsData, refetch } = useQuery(
    ['posts', page],
    () => PostAPI.getAllPostsOfCurrentUser(page),
    { keepPreviousData: true }
  );

  useEffect(() => {
    moment.locale('vi');

    return () => {
      setSelectedPost(null);
    };
  }, []);

  return (
    <Box
      paddingTop={8}
      paddingBottom={8}
      paddingInlineStart={8}
      paddingInlineEnd={8}
      marginInline="auto"
      marginTop="2rem"
      maxW="6xl"
      w="100%"
    >
      {selectedPost && (
        <PostFormDrawer
          isOpen={isPostFormOpen}
          onClose={togglePostForm}
          postData={selectedPost}
          refetch={refetch}
        />
      )}
      <Flex background="white" boxShadow="sm" borderRadius="lg">
        <TableContainer whiteSpace="unset" w="full">
          <Flex
            padding={6}
            justifyContent="space-between"
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <Text fontWeight="600" fontSize="xl">
              Danh sách câu hỏi đã đăng
            </Text>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tiêu đề</Th>
                <Th>Mô tả</Th>
                <Th>Số lượt upvote</Th>
                <Th>Số lượt downvote</Th>
                <Th>Thời gian tạo</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            {isLoading ? (
              <Tbody>
                <Tr>
                  <Td>
                    <Spinner mt={2} ml={2} />
                  </Td>
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {postsData?.data?.length > 0 &&
                  postsData.data.map((post, i) => (
                    <Tr key={`post-${i + 1}`}>
                      <Td>{post.title}</Td>
                      <Td>{post.body}</Td>
                      <Td>{post.upvoteCount}</Td>
                      <Td>{post.downvoteCount}</Td>
                      <Td>{moment(post.created_at).format('lll')}</Td>
                      <Td>
                        <Flex gap={2}>
                          <IconButton
                            icon={<HiOutlineEye />}
                            fontSize="20px"
                            onClick={() =>
                              history(
                                `/posts/${post.university.slug}/${post.id}`
                              )
                            }
                          />
                          <IconButton
                            icon={<HiPencil />}
                            fontSize="20px"
                            onClick={() => {
                              setSelectedPost(post);
                              togglePostForm();
                            }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && postsData?.data?.length === 0 ? (
            <Box textAlign="center" p="20px	100px" color="gray.800">
              Chưa có tin đăng
            </Box>
          ) : (
            <Flex justifyContent="space-between" px={6} py={2}>
              <Button
                leftIcon={<HiChevronLeft />}
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                isDisabled={!postsData?.prev_page_url}
              >
                Trước
              </Button>
              <Button
                rightIcon={<HiChevronRight />}
                onClick={() => setPage((old) => old + 1)}
                isDisabled={!postsData?.next_page_url}
              >
                Sau
              </Button>
            </Flex>
          )}
        </TableContainer>
      </Flex>
    </Box>
  );
}
