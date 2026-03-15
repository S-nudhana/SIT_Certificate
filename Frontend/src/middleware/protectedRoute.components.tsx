import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../services/axios/axiosInstances";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {

    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axiosInstance.get("/user/authorize");
                console.log(res.data)
                setAuthorized(res.data.data.authorized);
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return <>{ children } </>;
}