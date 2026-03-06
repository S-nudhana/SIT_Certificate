import { Button, Container, Typography, Box } from "@mui/material";

export default function Login() {

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3
        }}
      >
        <Typography variant="h4">
          Sign In
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};