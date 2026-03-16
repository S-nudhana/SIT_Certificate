import { Button } from "@mui/material";

import type { ButtonType } from "../types/components.type";

export default function ButtonComponent({startIcon, endIcon, rounded, text, width, onclick}: ButtonType) {
    return (
        <Button
            variant="contained"
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onclick}
            sx={{
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: "#0C86FE",
                color: "#fff",
                textTransform: "none",
                borderRadius: rounded ? "9999px" : "none",
                px: 3,
                width: width,
                transform: ".2s",
                boxShadow: "0 3px 7px rgba(12,134,254,0.3)",
                "&:hover": {
                    backgroundColor: "#097df2",
                    boxShadow: "0 3px 7px rgba(12,134,254,0.3)",
                },
            }}
        >
            {text}
        </Button>
    )
}
