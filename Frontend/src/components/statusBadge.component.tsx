import { Box, Typography } from "@mui/material";
import { MdDescription, MdEdit, MdCheckCircle } from "react-icons/md";

import type { StatusBadgeProps } from "../types/components.type";

export default function StatusBadge({ status, size = "large" }: StatusBadgeProps) {
  const isSmall = size === "small";
  const iconSize = isSmall ? 12 : 14;
  const px = isSmall ? 1.5 : 2;
  const py = isSmall ? 0.5 : 0.75;
  const borderRadius = isSmall ? "16px" : "20px";
  const fontSize = isSmall ? "0.7rem" : "0.75rem";
  const gap = isSmall ? 0.3 : 0.5;

  const baseStyles = {
    display: "flex",
    alignItems: "center",
    gap,
    px,
    py,
    borderRadius,
  } as const;

  switch (status) {
    case "created":
      return (
        <Box
          sx={{
            ...baseStyles,
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
          }}
        >
          <MdDescription size={iconSize} style={{ color: "#6b7280" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#6b7280", fontSize }}>
            ฉบับร่าง
          </Typography>
        </Box>
      );
    case "cert_generated":
      return (
        <Box
          sx={{
            ...baseStyles,
            backgroundColor: "#fed7aa",
            border: "1px solid #ea580c",
          }}
        >
          <MdEdit size={iconSize} style={{ color: "#ea580c" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#ea580c", fontSize }}>
            รอลงนาม
          </Typography>
        </Box>
      );
    case "signed":
      return (
        <Box
          sx={{
            ...baseStyles,
            backgroundColor: "#d1fae5",
            border: "1px solid #10b981",
          }}
        >
          <MdCheckCircle size={iconSize} style={{ color: "#059669" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#059669", fontSize }}>
            เสร็จสิ้น
          </Typography>
        </Box>
      );
    default:
      return null;
  }
}
