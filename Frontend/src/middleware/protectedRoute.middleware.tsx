import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { setAuth } from "../store/slices/authSlices";
import { Box } from "@mui/material";

import type { Props } from "../types/middleware.type";
import { useAppDispatch } from "../hooks/redux";
import { authorizeAPI } from "../services/apis/user.api";

export default function ProtectedRoute({ children }: Props) {

    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authorizeAPI()
                setAuthorized(res.data.data.authorized)
                dispatch(
                    setAuth({
                        authorized: res.data.data.authorized,
                        firstname: res.data.data.userFirstname
                    })
                )
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [dispatch]);

    if (loading) return (
        <Box>
        </Box >
    )
    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}