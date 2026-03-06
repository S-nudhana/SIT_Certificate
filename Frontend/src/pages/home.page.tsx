import { Container, Typography, Button, Stack } from "@mui/material";
import axiosInstance from "../services/axios/axiosInstances";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/user/logout");
      console.log(res)
      if (res.status === 200) {
        navigate("/login")
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Stack spacing={4} alignItems="center">

        <Typography variant="h3" fontWeight={700}>
          Test
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Welcome to the test system demo.
        </Typography>

        <Button
          variant="contained"
          size="large"
        >
          View
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>

      </Stack>
    </Container>
  );
}