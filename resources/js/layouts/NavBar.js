import React, { useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast
} from '@chakra-ui/react';
import { Link as NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineUserCircle,
  HiOutlinePencilAlt,
  HiChevronDown
} from 'react-icons/hi';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useAppContext } from '../contexts/AppContext';
import UserAuthAPI from '../api/UserAuthAPI';
import { setUserToken } from '../utils/userAuth';

const headerLinks = [
  { content: 'Trang chủ', icon: HiOutlineHome, to: '/' },
  {
    content: 'Quản lý bài đăng',
    icon: HiOutlineClipboardList,
    to: '/manage-posts'
  }
];

export default function NavBar() {
  const toast = useToast();
  const history = useNavigate();
  const {
    authenticated,
    currentUser,
    setCurrentUser
  } = useUserAuth();
  const { verse, toggleSelectVerseModal } = useAppContext();

  const handleLogOut = useCallback(() => {
    UserAuthAPI.logout().then((response) => {
      if (response.success) {
        setCurrentUser(null);
        setUserToken(null);
        history('/');
        toast({
          title: response.message,
          duration: 3000,
          status: 'success'
        });
      } else {
        toast({
          title: 'Đăng xuất thất bại',
          duration: 3000,
          status: 'error'
        });
      }
    });
  }, [history, setCurrentUser, toast]);
  return (
    <>
      <Box
        w="full"
        backgroundColor="purple.300"
        position="sticky"
        top={0}
        zIndex="1000"
      >
        <Flex alignItems="center" w="5xl" minW="sm" m="0 auto">
          <Flex
            flex="0.3 1 auto"
            justifyContent="flex-start"
            textAlign="left"
            alignItems="center"
            gap={2}
          >
            <Link as={NavLink} to="/" _hover={{}} _focus={{}}>
              <Text
                fontSize="2xl"
                color="white"
                fontWeight="500"
                fontFamily="logoFont"
              >
                qa-Multiverse
              </Text>
            </Link>
            {verse ? (
              <Box>
                <Badge
                  color="purple"
                  bg="white"
                  onClick={toggleSelectVerseModal}
                  cursor="pointer"
                >
                  <Flex alignItems="center">
                    <Text textTransform="uppercase">{verse}</Text>
                    <Icon as={HiChevronDown} />
                  </Flex>
                </Badge>
              </Box>
            ) : null}
          </Flex>
          <Flex flex="0.7 0 auto" justifyContent="flex-end">
            <Flex gap={7} alignItems="center">
              {headerLinks.map(({ content, icon, to }, i) => (
                <Link
                  as={NavLink}
                  to={to}
                  h={14}
                  display="flex"
                  key={`navlink-${i + 1}`}
                >
                  <Flex alignItems="center" gap={2}>
                    <Icon as={icon} w={6} h={6} />
                    <Text fontWeight="500" fontSize="lg">
                      {content}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <Box
        w="full"
        backgroundColor="purple.300"
        position="sticky"
        top={14}
        zIndex="1000"
        pb={3}
      >
        <Flex
          alignItems="center"
          w="5xl"
          minW="sm"
          m="0 auto"
          gap={12}
        >
          <InputGroup size="md" w="65%">
            <Input
              pr="4rem"
              backgroundColor="white"
              placeholder="Tìm kiếm câu hỏi"
              fontWeight="500"
            />
            <InputRightElement width="3.5rem">
              <IconButton
                h={6}
                colorScheme="none"
                size="sm"
                icon={
                  <Icon
                    as={HiOutlineSearch}
                    w={6}
                    h={6}
                    color="purple.300"
                  />
                }
              />
            </InputRightElement>
          </InputGroup>

          {authenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                fontSize="lg"
                bg="none"
                _hover={{ bg: 'none', color: 'gray.700' }}
                _active={{ bg: 'none' }}
                leftIcon={
                  <Icon as={HiOutlineUserCircle} w={6} h={6} />
                }
              >
                {currentUser.display_name}
              </MenuButton>
              <MenuList>
                <MenuItem
                  fontWeight={500}
                  onClick={() =>
                    history(`/profile/${currentUser.id}`)
                  }
                >
                  Trang cá nhân
                </MenuItem>
                <MenuItem
                  fontWeight={500}
                  onClick={() => handleLogOut()}
                >
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              fontSize="lg"
              bg="none"
              _hover={{ bg: 'none', color: 'gray.700' }}
              _active={{ bg: 'none' }}
              leftIcon={<Icon as={HiOutlineUserCircle} w={6} h={6} />}
              onClick={() => history('/login')}
            >
              Đăng nhập
            </Button>
          )}
          <Button
            fontSize="lg"
            bg="purple.700"
            color="white"
            _hover={{ bg: 'purple.600' }}
            _active={{ bg: 'purple.700' }}
            leftIcon={<Icon as={HiOutlinePencilAlt} w={6} h={6} />}
            onClick={() => history('/create')}
          >
            Đặt câu hỏi
          </Button>
        </Flex>
      </Box>
    </>
  );
}
