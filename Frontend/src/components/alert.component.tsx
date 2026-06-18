import { Alert, Fade } from '@mui/material';
import type { AlertProps } from '../types/components.type';

export default function AlertComponent({ status, message }: AlertProps) {
  return (
    <Fade in={true} timeout={500}>
      <Alert severity={status}>{message}</Alert>
    </Fade>
  );
}
