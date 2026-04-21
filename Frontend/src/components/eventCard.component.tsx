import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { MdGroup } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import StatusBadge from "../components/statusBadge.component";
import type { EventCardProps } from "../types/components.type";

export default function EventCard({
  id,
  title,
  participants,
  status,
  imageSrc,
}: EventCardProps) {
  const navigate = useNavigate();
  const baseImageUrl = import.meta.env.VITE_IMG_URL;
  const fullImageUrl = imageSrc ? `${baseImageUrl}${imageSrc}` : null;
  const handleActivityClick = (activityId: string) => {
    navigate(`/event/${activityId}`);
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} size="small" />;
  };

  return (
    <Paper
      key={id}
      onClick={() => handleActivityClick(id!)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        border: "1px solid #f3f4f6",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box>
        {fullImageUrl ? (
          <img src={fullImageUrl} alt="Event Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#e5e7eb",
            }}
          >
            <Typography sx={{ color: "#6b7280" }}>No Preview Available</Typography>
            <Divider />
          </Box>
        )}
      </Box>
      <Box sx={{ p: "20px" }}>
        <Stack spacing={1}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <MdGroup size={18} color="#6b7280" />
            <Typography
              sx={{
                fontSize: "16px",
                color: "#6b7280",
                fontWeight: 400,
              }}
            >
              {participants} ผู้เข้าร่วม
            </Typography>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            {getStatusBadge(status)}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}