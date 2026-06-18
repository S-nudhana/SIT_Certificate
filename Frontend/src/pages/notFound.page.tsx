import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

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
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "40px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            sx={{
              fontSize: "80px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #0048FF, #44B0FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Typography
            sx={{ fontSize: "20px", fontWeight: "600", mt: 2 }}
          >
            ไม่พบหน้าที่ต้องการ
          </Typography>

          <Typography
            sx={{ color: "#838B9D", fontWeight: "400", fontSize: "16px", mt: 1 }}
          >
            หน้าที่คุณกำลังค้นหาไม่มีอยู่หรือถูกย้ายไปแล้ว
          </Typography>

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              mt: 3,
              p: "7px 17px",
              bgcolor: "transparent",
              color: "#616161",
              borderColor: "#E4E4E4",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "500",
              "&:hover": {
                borderColor: "#b1b1b1",
              },
            }}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
      </Box>
    </Container>
  );
}