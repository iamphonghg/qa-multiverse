import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Flex,
  Text,
  Portal,
  Box
} from '@chakra-ui/react';
import { HiOutlineBell } from 'react-icons/hi';
import { useNotificationContext } from '../contexts/NotificationContext';

const getTextColor = {
  info: 'blue.500',
  warning: 'yellow.500',
  dangerous: 'red.500'
};

export default function NotificationPopover() {
  const {
    notifications,
    hasNewNoti,
    toggleNewNoti
  } = useNotificationContext();

  return (
    <Popover>
      <PopoverTrigger>
        <Flex alignItems="center">
          <Box position="relative">
            <IconButton
              onClick={toggleNewNoti}
              icon={
                <HiOutlineBell color="purple.600" fontSize="1.5rem" />
              }
              variant="ghost"
            />
            {hasNewNoti && (
              <Box
                w="10px"
                h="10px"
                bg="red"
                borderRadius="50%"
                position="absolute"
                top={1}
                right={1}
              />
            )}
          </Box>
          <Text fontWeight="500" fontSize="lg">
            Thông báo
          </Text>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Text color="purple.500" fontWeight="bold">
              Thông báo
            </Text>
          </PopoverHeader>
          <PopoverBody
            maxH="300px"
            overflowY="auto"
            display="flex"
            flexDir="column"
            gap={2}
          >
            {notifications && notifications.length > 0 ? (
              notifications.map((noti) => (
                <Flex
                  flexDir="column"
                  p={2}
                  border="1px solid #b794f4"
                >
                  <Text
                    fontWeight={500}
                    color={getTextColor[noti.variant]}
                  >
                    {noti.title}
                  </Text>
                  <Text>{noti.description}</Text>
                </Flex>
              ))
            ) : (
              <Flex justifyContent="center">Chưa có thông báo</Flex>
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
