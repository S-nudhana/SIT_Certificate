import { Button } from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function BackBTN() {
    const navigate = useNavigate();
    return (
        <Button
            onClick={() => navigate(-1)}
            sx={{
                minWidth: "auto",
                color: "#64748b",
                padding: "4px",
                mt: 0.5,
                "&:hover": { backgroundColor: "transparent", color: "#1e293b" },
            }}
        >
            <MdArrowBack size={20} />
        </Button>
    )
}