import { updateUser } from "@/api/user";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUser = () => {
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (formData: any) => updateUser(formData),
        onSuccess: () => {
            toast.success("Profile updated successfully!");
        },
        onError: (error:any) => {
            toast.error("Failed to update profile.");
        }
    });
}