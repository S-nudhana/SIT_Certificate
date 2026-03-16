import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import type { Props } from "../types/middleware.type";


export default function PublicRoute({ children }: Props) {
    const authorized = useSelector((state: RootState) => state.auth.authorized);
    if (authorized) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}