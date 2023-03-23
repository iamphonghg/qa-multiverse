import React, { useState } from 'react';
import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBox() {
  const [inputString, setInputString] = useState('');

  return (
    <Flex>
      <InputGroup size="md" w="65%">
        <Input
          pr="25rem"
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
      {/* <Autocomplete
        getItemValue={(item) => item.label}
        items={[
          { label: 'apple' },
          { label: 'banana' },
          { label: 'pear' }
        ]}
        renderItem={(item, isHighlighted) => (
          <div
            style={{
              background: isHighlighted ? 'lightgray' : 'white'
            }}
          >
            {item.label}
          </div>
        )}
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        onSelect={(val) => setInputString(val)}
      /> */}
    </Flex>
  );
}
