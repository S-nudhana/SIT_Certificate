import axiosInstance from "../axios/axiosInstances";

export async function logoutAPI() {
    const res = await axiosInstance.get("/user/logout");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Logout failed");
}

export async function authorizeAPI() {
    const res = await axiosInstance.get("/user/authorize");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Unauthorized");
}