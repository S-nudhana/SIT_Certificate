import { Button, Container, Typography, Box, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

import logo from "../../public/assets/30SIT.png";

export default function Login() {

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4, backgroundColor: "white", borderRadius: "10px", padding: "40px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <img src={logo} alt="Logo" style={{ width: "200px", height: "auto", marginBottom: "10px" }} />
          <Divider></Divider>
          <Typography component="h1" gutterBottom sx={{ mt: 2, fontSize: "20px" }}>
            เข้าสู่ระบบ
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", mb: 2, gap: "10px" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "bold" }}>
              SIT
            </Typography>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #0048FF, #44B0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Certificate
            </Typography>
          </Box>
          <Typography sx={{ color: "#838B9D", fontWeight: "normal", fontSize: "16px" }}>
            ระบบจัดการจัดการชุดใบประกาศนียบัตร
          </Typography>
          <Button
            variant="outlined"
            onClick={handleGoogleLogin}
            startIcon={<FcGoogle />}
            sx={{
              mt: 3,
              p: "7px 17px",
              bgcolor: "transparent",
              color: "#757575",
              borderColor: "#E4E4E4",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "normal",
              "&:hover": {
                borderColor: "#b1b1b1",
              }
            }}
          >
            เข้าสู่ระบบด้วยบัญชี Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
};