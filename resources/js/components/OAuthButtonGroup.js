import React from 'react';
import {
  Button,
  ButtonGroup,
  Icon,
  VisuallyHidden
} from '@chakra-ui/react';
import { BsTwitter, BsFacebook, BsGithub } from 'react-icons/bs';

const providers = [
  { name: 'Google', icon: <Icon as={BsTwitter} boxSize="5" /> },
  { name: 'Twitter', icon: <Icon as={BsFacebook} boxSize="5" /> },
  { name: 'GitHub', icon: <Icon as={BsGithub} boxSize="5" /> }
];

export const OAuthButtonGroup = () => (
  <ButtonGroup variant="outline" spacing="4" width="full">
    {providers.map(({ name, icon }) => (
      <Button key={name} isFullWidth>
        <VisuallyHidden>Sign in with {name}</VisuallyHidden>
        {icon}
      </Button>
    ))}
  </ButtonGroup>
);
