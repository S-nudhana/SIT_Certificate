import { Box } from "@mui/material";
import PDF from 'react-pdf-watermark';

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <>
      {fileUrl && (
        <Box boxShadow={'lg'} width={'100%'} height={'auto'} display={'flex'} justifyContent={'center'}>
          <PDF
            canvasWidth={'100%'}
            canvasHeight={'auto'}
            file={fileUrl}
          />
        </Box>
      )}
    </>
  );
}