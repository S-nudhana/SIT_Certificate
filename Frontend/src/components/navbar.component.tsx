import { AppBar, Toolbar, Box, Avatar, Button, Stack } from "@mui/material";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios/axiosInstances";
import logo from "../../public/assets/30SIT.png";

interface NavbarProps {
  userName?: string;
  userInitial?: string;
}

export default function Navbar({ userName = "Nannicha", userInitial = "N" }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/user/logout");
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 1,
          py: 1.5,
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img 
            src={logo} 
            alt="SIT 30 Anniversary" 
            style={{ height: 45, width: "auto" }}
          />
        </Box>

        {/* Right Section - Avatar & Logout */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Stack direction="row" spacing={1} sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                width: 40,
                height: 40,
              }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ color: "#1e293b", fontWeight: 500, fontSize: "0.95rem" }}>
              {userName}
            </Box>
          </Stack>

          <Button
            variant="outlined"
            size="small"
            startIcon={<MdLogout size={18} />}
            onClick={handleLogout}
            sx={{
              color: "#ef4444",
              borderColor: "#fecaca",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#fee2e2",
                borderColor: "#ef4444",
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
