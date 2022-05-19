import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text
} from '@chakra-ui/react';
import { Link as NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserCircle,
  HiOutlinePencilAlt
} from 'react-icons/hi';

const headerLinks = [
  { content: 'Trang chủ', icon: HiOutlineHome, to: '/' },
  { content: 'Quản lý tin', icon: HiOutlineClipboardList, to: '/' },
  { content: 'Chat', icon: HiOutlineChatAlt2, to: '/' },
  { content: 'Thông báo', icon: HiOutlineBell, to: '/' }
];

export default function NavBar() {
  // const { setCurrentUser, setToken } = useAuth();
  const history = useNavigate();
  // const { authenticated } = useAuth();

  // const handleLogOut = useCallback(() => {
  //   AuthAPI.logout().then((response) => {
  //     if (response.message) {
  //       setCurrentUser(null);
  //       setToken(null);
  //       history('/');
  //       setIntendedUrl(null);
  //     }
  //   });
  // }, [history, setCurrentUser, setToken]);

  return (
    <>
      <Box
        w="full"
        backgroundColor="blue.300"
        position="sticky"
        top={0}
        zIndex="1000"
      >
        <Flex alignItems="center" w="5xl" minW="sm" m="0 auto">
          <Flex
            flex="0.3 1 auto"
            justifyContent="flex-start"
            textAlign="left"
          >
            <Link as={NavLink} to="/" _hover={{}} _focus={{}}>
              <Text
                fontSize="2xl"
                color="white"
                fontWeight="500"
                fontFamily="logoFont"
              >
                ChoGioi
              </Text>
            </Link>
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
        backgroundColor="blue.300"
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
              placeholder="Tìm kiếm trên Chợ Giời"
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
                    color="blue.300"
                  />
                }
              />
            </InputRightElement>
          </InputGroup>

          {false ? (
            <Button
              fontSize="lg"
              bg="none"
              _hover={{ bg: 'none', color: 'gray.700' }}
              _active={{ bg: 'none' }}
              leftIcon={<Icon as={HiOutlineUserCircle} w={6} h={6} />}
            >
              Username
            </Button>
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
            bg="blue.700"
            color="white"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
            leftIcon={<Icon as={HiOutlinePencilAlt} w={6} h={6} />}
            onClick={() => history('/create')}
          >
            Đăng tin
          </Button>
        </Flex>
      </Box>
    </>
  );
}
