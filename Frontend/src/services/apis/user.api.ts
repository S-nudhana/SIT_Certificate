import axiosInstance from "../axios/axiosInstances";

export async function Logout() {
    const res = await axiosInstance.get("/user/logout");
    if (res.status === 200) {
        return res.data;
    }
    throw new Error("Logout failed");
}