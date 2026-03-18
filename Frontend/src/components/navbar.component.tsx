import { AppBar, Toolbar, Box, Avatar, Button, Stack } from "@mui/material";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "/assets/30SIT.png";
import { useSelector } from "react-redux";
import React from "react";

import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlices";
import { useAppDispatch } from "../hooks/redux";
import { Slide, useScrollTrigger } from "@mui/material";
import type { HideOnScrollProps } from "../types/components.type";

import { Logout } from "../services/apis/user.api";

function HideOnScroll(props: HideOnScrollProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

export default function Navbar(props: HideOnScrollProps) {
  const navigate = useNavigate();
  const firstname = useSelector((state: RootState) => state.auth.firstname);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const res = await Logout();
      if (res?.status === 200) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <React.Fragment>

      <HideOnScroll {...props}>
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
            <Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
              <img
                src={logo}
                alt="SIT 30 Anniversary"
                style={{ height: 45, width: "auto" }}
              />
            </Box>

            {/* Right Section - Avatar & Logout */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Stack direction="row" spacing={1} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    background: "#0C86FE",
                    color: "#fff",
                    fontWeight: 600,
                    width: 40,
                    height: 40,
                  }}
                >
                  {firstname?.charAt(0).toUpperCase() || "?"}
                </Avatar>
                <Box sx={{ color: "#1e293b", fontWeight: 500, fontSize: "18px", display: { xs: "none", sm: "block" } }}>
                  {firstname}
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
                  p: "5px 12px",
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
      </HideOnScroll>
    </React.Fragment>
  );
}
