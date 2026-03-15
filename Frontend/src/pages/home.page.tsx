import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  InputAdornment,
} from "@mui/material";
import { MdAdd, MdSearch, MdGroup } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.component";
import StatusBadge from "../components/statusBadge.component";
import { mockActivities } from "../data/mockData";
import type { Activity } from "../data/mockData";

export default function Homepage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActivityClick = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };

  const handleCreateActivity = () => {
    const newActivity: Activity = {
      id: String(Math.max(...activities.map((a) => parseInt(a.id)), 0) + 1),
      title: `New Activity ${new Date().getTime()}`,
      participants: 0,
      status: "draft",
      createdAt: new Date().toLocaleDateString("th-TH"),
      updatedAt: new Date().toLocaleDateString("th-TH"),
    };
    setActivities([newActivity, ...activities]);
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} size="small" />;
  };

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar userName="Nannicha" userInitial="N" />

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            color: "#111827",
            mb: 2,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          SIT <span style={{ color: "#3b82f6" }}>Certificate</span>
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#6b7280",
            mb: 4,
          }}
        >
          จัดการชุดใบประกาศนียบัตร
        </Typography>

        {/* Search */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          <TextField
            fullWidth
            placeholder="ค้นหากิจกรรม เวิร์กชอป หรือสัมมนา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "9999px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                paddingLeft: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch size={20} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "9999px",
              px: 3,
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
          >
            ค้นหา
          </Button>
        </Box>
      </Box>

      {/* Activities Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Header */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 4,
                height: 24,
                backgroundColor: "#3b82f6",
                borderRadius: "9999px",
              }}
            />
            <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827" }}>
              กิจกรรม
            </Typography>
          </Stack>
          <Button
            startIcon={<MdAdd size={18} />}
            variant="contained"
            onClick={handleCreateActivity}
            sx={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "9999px",
              px: 3,
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
          >
            สร้างกิจกรรม
          </Button>
        </Stack>

        {/* Activity Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {filteredActivities.map((activity) => (
            <Paper
              key={activity.id}
              onClick={() => handleActivityClick(activity.id)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "1rem",
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
              {/* Image */}
              <Box
                sx={{
                  backgroundColor: "#f3f4f6",
                  height: 176,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              {/* Content */}
              <Box sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {/* Title */}
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#111827",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                    }}
                  >
                    {activity.title}
                  </Typography>

                  {/* Participants */}
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <MdGroup size={16} color="#6b7280" />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {activity.participants} ผู้เข้าร่วม
                    </Typography>
                  </Stack>

                  {/* Status Badge */}
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    {getStatusBadge(activity.status)}
                  </Box>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}