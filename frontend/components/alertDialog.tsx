import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  open,
  title,
  content,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
}
