import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";
import { MdAdd, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/statusBadge.component";

import { useGetAllEvents } from "../hooks/query/event.query";

import Navbar from "../components/navbar.component";
import ButtonComponent from "../components/button.component";
import EventCard from "../components/eventCard.component";

export default function Homepage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAllEvents();
  const activities = data?.data?.data?.events || [];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter((activity: any) =>
    activity.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateActivity = () => {
    navigate("/event/create");
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: 'center', alignItems: "center" }}>
        <StatusBadge status="loading" size="small" />
      </Box>
    );
  }

  if (isError) {
    return <div>Failed to load events</div>;
  }

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <Typography sx={{
            fontSize: { xs: "40px", md: "52px" },
            fontWeight: 700,
            color: "#111827",
          }}>
            SIT
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "40px", md: "52px" },
              fontWeight: "bold",
              background: "linear-gradient(90deg, #0048FF, #44B0FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Certificate
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "18px",
            color: "#6b7280",
            mb: 4,
          }}
        >
          ระบบจัดการชุดใบประกาศนียบัตร
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MdSearch size={20} color="#9ca3af" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <ButtonComponent
            startIcon={<MdSearch />}
            endIcon={null}
            text="ค้นหา"
            width="100px"
            rounded
          />
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
                width: 5,
                height: 30,
                background: "linear-gradient(180deg, #557fe8, #44B0FF)",
                borderRadius: "9999px",
              }}
            />
            <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>
              กิจกรรม
            </Typography>
          </Stack>
          <ButtonComponent
            startIcon={<MdAdd size={18} />}
            onclick={handleCreateActivity}
            text="สร้างกิจกรรม"
            width="150px"
            rounded
          />
        </Stack>

        {/* Activity Cards Grid */}

        {filteredActivities.length === 0 ? (
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "200px",
            color: "#6b7280",
          }}>
            <Typography>
              ไม่พบกิจกรรม {searchQuery == "" ? "" : `ที่ตรงกับ "${searchQuery}"`}
            </Typography>
          </Box>
        ) : (
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
            {filteredActivities.map((activity: any) => (
              <EventCard
                key={activity.eventID}
                id={activity.eventID}
                imageSrc={activity.eventCertificateCover}
                title={activity.eventTitle}
                participants={activity.eventParticipant}
                status={activity.eventStatus}
              />
            ))}
          </Box>
        )}
      </Container >
    </Box >
  );
}