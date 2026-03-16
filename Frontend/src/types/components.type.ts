import type { ResponsiveStyleValue } from "@mui/system";

export interface ButtonType {
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    rounded?: boolean,
    text: string,
    width?: ResponsiveStyleValue<string>,
    onclick?: () => void
}


export interface EventCardProps {
    id?: string;
    title: string;
    participants: number;
    status: string
    imageSrc?: string;
    onClick?: () => void;
}

export interface StatusBadgeProps {
    status: string
    size?: "small" | "large";
}