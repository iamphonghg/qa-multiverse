import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import { HiChevronRight } from 'react-icons/hi';

const verseSeletions = ['hust', 'neu', 'nuce', 'hou'];

export default function SelectVerseModal({
  isOpen,
  onClose,
  setVerse
}) {
  const handleSelectVerse = useCallback(
    (verse) => {
      setVerse(verse);
      localStorage.setItem('verse', verse);
      onClose();
    },
    [onClose, setVerse]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Box mb={8}>
            <Flex flexDir="column" alignItems="center" gap={4}>
              <Text fontSize="3xl" fontWeight="700">
                Chọn vũ trụ của bạn
              </Text>
              <Flex
                flexDir="column"
                justifyContent="center"
                w="80%"
                gap={2}
              >
                {verseSeletions.map((verse, i) => (
                  <Button
                    variant="outline"
                    onClick={() => handleSelectVerse(verse)}
                    key={`verse-${i + 1}`}
                  >
                    <Flex
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text textTransform="uppercase">{verse}</Text>
                      <Icon as={HiChevronRight} />
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
