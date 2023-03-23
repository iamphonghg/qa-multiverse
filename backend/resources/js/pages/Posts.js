/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencil,
  HiOutlineTrash
} from 'react-icons/hi';
import { useQuery } from 'react-query';
import UserAPI from '../api/UserAPI';
import AdminAPI from '../api/AdminAPI';
import UserInfoFormDrawer from '../components/UserInfoFormDrawer';
import PostFormDrawer from '../components/PostFormDrawer';

const ConfirmToggleBlockUserModal = ({
  isOpen,
  onClose,
  selectedPost,
  refetch
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleToggleBlockUser = useCallback(() => {
    setIsSubmitting(true);
    AdminAPI.deletePost({ id: selectedPost.id })
      .then((response) => {
        setIsSubmitting(false);
        toast({
          title: response.message,
          status: response.success ? 'success' : 'error',
          duration: 3000
        });
        onClose();
        refetch();
      })
      .catch(() => {
        setIsSubmitting(false);
        toast({
          title: 'Xảy ra lỗi không xác định',
          status: 'error',
          duration: 3000
        });
      });
  }, [onClose, refetch, selectedPost.id, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Xác nhận xóa bài đăng</ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="red"
            onClick={handleToggleBlockUser}
            isLoading={isSubmitting}
          >
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Posts() {
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState({});
  const [
    isOpenConfirmToggleBlockModal,
    setIsOpenConfirmToggleBlockModal
  ] = useState(false);

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const togglePostForm = useCallback(() => {
    setIsPostFormOpen((prev) => !prev);
  }, []);

  const toggleConfirmBlockModal = useCallback((post) => {
    setSelectedPost(post);
    setIsOpenConfirmToggleBlockModal(true);
  }, []);

  const { isLoading, data: postsData, refetch } = useQuery(
    ['posts', page, searchString, filterQuery],
    () => AdminAPI.getAllPosts(page, searchString, filterQuery),
    { keepPreviousData: true }
  );

  return (
    <Box
      paddingTop={8}
      paddingBottom={8}
      paddingInlineStart={8}
      paddingInlineEnd={8}
      marginInline="auto"
      marginTop="2rem"
      maxW="10xl"
      w="100%"
    >
      <ConfirmToggleBlockUserModal
        isOpen={isOpenConfirmToggleBlockModal}
        onClose={() =>
          setIsOpenConfirmToggleBlockModal((prev) => !prev)
        }
        selectedPost={selectedPost}
        refetch={refetch}
      />
      {selectedPost && (
        <PostFormDrawer
          isOpen={isPostFormOpen}
          onClose={togglePostForm}
          postData={selectedPost}
          refetch={refetch}
          isAdmin
        />
      )}
      <Flex background="white" boxShadow="sm" borderRadius="lg">
        <TableContainer whiteSpace="unset" w="full">
          <Flex padding={6} justifyContent="space-between">
            <Text fontWeight="600" fontSize="xl">
              Danh sách bài đăng
            </Text>
          </Flex>
          <Flex
            justifyContent="flex-end"
            gap={3}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <Input
              placeholder="Search by name"
              size="sm"
              w="13%"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <Select
              size="sm"
              w="17%"
              mr={6}
              mb={3}
              onChange={(e) => {
                setFilterQuery(e.target.value);
              }}
            >
              {[
                { name: 'None', id: 'none' },
                { name: 'Upvote', id: 'upvote' },
                { name: 'Downvote', id: 'downvote' }
              ].map(({ name, id }) => (
                <option key={`category-filter-${id}`} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tiêu đề</Th>
                <Th>Nội dung</Th>
                <Th>Người đăng</Th>
                <Th>Lượt upvote</Th>
                <Th>Lượt downvote</Th>
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
                      <Td>
                        <Button
                          variant="link"
                          onClick={() =>
                            window.open(
                              `/posts/${post?.university?.slug}/${post?.id}`
                            )
                          }
                        >
                          {post.title}
                        </Button>
                      </Td>
                      <Td>{post.body}</Td>
                      <Td>
                        <Button
                          variant="link"
                          onClick={() =>
                            window.open(`/profile/${post?.user?.id}`)
                          }
                        >
                          {post?.user?.display_name}
                        </Button>
                      </Td>
                      <Td>
                        <Text color="gray.600">
                          {post?.upvoteCount}
                        </Text>
                      </Td>
                      <Td>
                        <Text color="gray.600">
                          {post?.downvoteCount}
                        </Text>
                      </Td>
                      <Td>
                        <Flex gap={1}>
                          <IconButton
                            icon={<HiOutlinePencil />}
                            fontSize="20px"
                            onClick={() => {
                              setSelectedPost(post);
                              togglePostForm(post);
                            }}
                          />
                          <IconButton
                            colorScheme="red"
                            icon={<HiOutlineTrash />}
                            fontSize="20px"
                            onClick={() =>
                              toggleConfirmBlockModal(post)
                            }
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
              Chưa có người dùng
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
