import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';

const ColorButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: '#13aa52',
  borderRadius: '24px',
  left: '-80px',
  border: '1px solid white',
  minHeight:'43px',
  '&:hover': {
    backgroundColor: 'rgb(2,52,48)',
  },
}));

export default function FancyButton() {
  return (
    <ColorButton variant="contained">QUERY</ColorButton>
  );
}
