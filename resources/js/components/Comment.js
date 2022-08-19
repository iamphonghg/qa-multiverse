import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function Comment({ body, author, createdAt }) {
  const history = useNavigate();
  return (
    <Box py={2} borderBottomWidth={1} borderColor="gray.100" w="full">
      <Text display="inline">{body}</Text>
      <Text display="inline">
        {' '}
        -{' '}
        <Button
          variant="link"
          onClick={() => history(`/profile/${author.id}`)}
        >
          {author.display_name}
        </Button>
      </Text>
      <Text display="inline" color="gray.500">
        {' '}
        {moment(createdAt).format('lll')}
      </Text>
    </Box>
  );
}
