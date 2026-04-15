import axiosInstance from "@/lib/axiosInstance";

export const updateUser = async (FormData: any) => {
    const res = await axiosInstance.post("/api/users/update", FormData);
    return res.data;
}