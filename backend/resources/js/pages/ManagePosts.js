import React, { useEffect, useState } from 'react';
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
  HiOutlineEye
} from 'react-icons/hi';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import PostAPI from '../api/PostAPI';

export default function ManagePosts() {
  const [page, setPage] = useState(1);
  const history = useNavigate();
  const { isLoading, data: postsData } = useQuery(
    ['posts', page],
    () => PostAPI.getAllPostsOfCurrentUser(page),
    { keepPreviousData: true }
  );

  console.log(postsData);

  useEffect(() => {
    moment.locale('vi');
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
                        <IconButton
                          icon={<HiOutlineEye />}
                          fontSize="20px"
                          onClick={() =>
                            history(
                              `/posts/${post.university.slug}/${post.id}`
                            )
                          }
                        />
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
