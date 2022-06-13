import React, { useState, useContext, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from "axios";
import * as Constants from '../Constants';
import AuthContext from "../contexts/AuthContext.jsx";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FancyModal = ({handleClose, open, preferences}) => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" >
            Primay DNS: {preferences.primary_dns}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" >
            Secondary DNS: {preferences.secondary_dns}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default FancyModal;
