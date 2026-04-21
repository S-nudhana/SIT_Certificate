import { Card, CardContent, Typography, Stack } from "@mui/material";

interface UploadCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onDrop?: (files: FileList) => void;
  onClick?: () => void;
  acceptedFormats?: string;
}

export default function UploadCard({
  icon,
  title,
  subtitle,
  onDrop,
  onClick,
  acceptedFormats,
}: UploadCardProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "#f0f4f7";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "#f9fafb";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "#f9fafb";
    if (onDrop && e.dataTransfer.files) {
      onDrop(e.dataTransfer.files);
    }
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        border: "2px dashed #cbd5e1",
        backgroundColor: "#f9fafb",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#f0f4f7",
          borderColor: "#0C86FE",
        },
      }}
    >
      <CardContent>
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          {icon}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#1e293b",
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {subtitle}
          </Typography>
          {acceptedFormats && (
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontSize: "0.75rem",
              }}
            >
              {acceptedFormats}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
