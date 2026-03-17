import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Box, CircularProgress } from "@mui/material";

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(300);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <Document file={fileUrl} loading={<Box sx={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>} error={<Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><p>Failed to load PDF.</p></Box>}>
      <Page pageNumber={1} width={width} />
    </Document>
    </div >
  );
}