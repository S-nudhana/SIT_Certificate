import { Card, CardMedia, CardContent, Box, Typography, Stack, Chip, Menu, MenuItem, Button } from "@mui/material";
import { MdMoreVert, MdGroup } from "react-icons/md";
import { useState } from "react";

interface ActivityCardProps {
  id?: string;
  title: string;
  participants: number;
  status: "draft" | "awaiting-signature" | "completed";
  imageSrc?: string;
  onClick?: () => void;
  onStatusChange?: (status: "draft" | "awaiting-signature" | "completed") => void;
  onDelete?: () => void;
}

export default function ActivityCard({
  title,
  participants,
  status,
  imageSrc,
  onClick,
  onStatusChange,
  onDelete,
}: ActivityCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: "draft" | "awaiting-signature" | "completed") => {
    handleMenuClose();
    onStatusChange?.(newStatus);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.();
  };

  const getStatusBadge = () => {
    switch (status) {
      case "draft":
        return (
          <Chip
            label="ฉบับร่าง"
            variant="outlined"
            sx={{
              borderColor: "#cbd5e1",
              color: "#64748b",
              fontWeight: 500,
              height: 28,
            }}
          />
        );
      case "awaiting-signature":
        return (
          <Chip
            icon={<span style={{ marginRight: "4px" }}>🔥</span>}
            label="รอลงนาม"
            variant="outlined"
            sx={{
              borderColor: "#fed7aa",
              color: "#ea580c",
              fontWeight: 500,
              height: 28,
            }}
          />
        );
      case "completed":
        return (
          <Chip
            icon={<span style={{ marginRight: "4px" }}>✓</span>}
            label="เสร็จสิ้น"
            sx={{
              backgroundColor: "#10b981",
              color: "#fff",
              fontWeight: 500,
              height: 28,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Image Placeholder */}
      <CardMedia
        sx={{
          height: 200,
          backgroundColor: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        image={imageSrc}
      >
        {!imageSrc && (
          <Typography variant="body2" color="textSecondary">
            Image Placeholder
          </Typography>
        )}
      </CardMedia>

      <CardContent sx={{ pb: 2 }}>
        <Stack spacing={2}>
          {/* Title with Menu */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {title}
            </Typography>
            <Button
              size="small"
              onClick={handleMenuClick}
              sx={{
                minWidth: "auto",
                color: "#94a3b8",
                padding: "4px",
                ml: 1,
              }}
            >
              <MdMoreVert size={18} />
            </Button>
          </Stack>

          {/* Status Menu */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => handleStatusChange("draft")}
              selected={status === "draft"}
            >
              ฉบับร่าง
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusChange("awaiting-signature")}
              selected={status === "awaiting-signature"}
            >
              รอลงนาม
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusChange("completed")}
              selected={status === "completed"}
            >
              เสร็จสิ้น
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "#ef4444" }}>
              ลบกิจกรรม
            </MenuItem>
          </Menu>

          {/* Participants Line */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <MdGroup style={{ fontSize: "1.2rem", color: "#64748b" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {participants} ผู้เข้าร่วม
            </Typography>
          </Stack>

          {/* Status Badge */}
          <Box>{getStatusBadge()}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
