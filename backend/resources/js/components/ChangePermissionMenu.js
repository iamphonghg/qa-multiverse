import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useMutation } from 'react-query';
import AdminAPI from '../api/AdminAPI';

export default function ChangePermissionMenu({
  canCreatePost,
  canVote,
  canEditPost,
  canComment,
  userId,
  refetch
}) {
  const toast = useToast();

  const { mutate: changePermisison } = useMutation(
    (data) => AdminAPI.changePermisison(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast({
            title: response.message,
            status: 'success',
            position: 'top',
            duration: 3000
          });
          refetch();
        } else {
          toast({
            title: response.message,
            status: 'error',
            position: 'top',
            duration: 3000
          });
        }
      },
      onError: () => {
        toast({
          title: 'Xảy ra lỗi không xác định',
          status: 'error',
          position: 'top',
          duration: 3000
        });
      }
    }
  );

  const handleChangePermission = useCallback(
    (permission, isRevoke) => {
      changePermisison({ permission, isRevoke, userId });
    },
    [changePermisison, userId]
  );

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Thay đổi quyền
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() =>
            handleChangePermission('create_post', canCreatePost)
          }
        >
          {canCreatePost
            ? 'Khóa quyền tạo bài đăng'
            : 'Mở quyền tạo bài đăng'}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleChangePermission('edit_post', canEditPost)
          }
        >
          {canEditPost
            ? 'Khóa quyền sửa bài đăng'
            : 'Mở quyền sửa bài đăng'}
        </MenuItem>
        <MenuItem
          onClick={() => handleChangePermission('vote', canVote)}
        >
          {canVote ? 'Khóa quyền bình chọn' : 'Mở quyền bình chọn'}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleChangePermission('comment', canComment)
          }
        >
          {canComment ? 'Khóa quyền bình luận' : 'Mở quyền bình luận'}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
