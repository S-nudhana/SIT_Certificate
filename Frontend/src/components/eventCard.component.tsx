import { Box, Paper, Stack, Typography } from "@mui/material";
import { MdGroup } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import StatusBadge from "../components/statusBadge.component";

import PDFViewer from "./PDFViewer.component";
import type { EventCardProps } from '../types/components.type';

export default function EventCard({ id, title, participants, status, imageSrc }: EventCardProps) {
    const navigate = useNavigate();
    const handleActivityClick = (activityId: string) => {
        navigate(`/event/${activityId}`);
    };

    const imageUrl = URL.createObjectURL(imageSrc ? new Blob([Uint8Array.from(atob(imageSrc), c => c.charCodeAt(0))], { type: "application/pdf" }) : new Blob());

    const getStatusBadge = (status: string) => {
        return <StatusBadge status={status} size="small" />;
    };

    return (
        <Paper
            key={id}
            onClick={() => handleActivityClick(id!)}
            sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
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
            {/* <Box
                sx={{
                    backgroundColor: "#f3f4f6",
                    height: 176,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            /> */}
            <Box>
                <PDFViewer key={imageSrc} fileUrl={imageUrl} />
            </Box>

            {/* Content */}
            <Box sx={{ p: "20px" }}>
                <Stack spacing={1}>
                    {/* Title */}
                    <Typography
                        sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#111827",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Participants */}
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <MdGroup size={18} color="#6b7280" />
                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#6b7280",
                                fontWeight: 400,
                            }}
                        >
                            {participants} ผู้เข้าร่วม
                        </Typography>
                    </Stack>

                    {/* Status Badge */}
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        {getStatusBadge(status)}
                    </Box>
                </Stack>
            </Box>
        </Paper>
    )
}
