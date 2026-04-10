import { useMutation } from "@tanstack/react-query";
import { Login, Resigter } from "@/types/api";
import { useRouter } from "next/navigation";
import { loginUser, register } from "@/api/auth";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore"
import { logout as logoutApi } from "@/api/auth";;



export const useLogin = () => {
    const navigate = useRouter();
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: (formData: Login) => loginUser(formData),

        onSuccess: (data) => {
            const user = data?.user;

            if (!user) {
                toast.error("Invalid server response");
                return;
            }

            const { name, email, mobile, avatar } = user;

            login({ name, email, mobile, avatar });
            toast.success("Login successful!");


            navigate.push("/");
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Login failed";

            toast.error(message);
        },
    });
};

export const useRegister = () => {
    const navigate = useRouter();

    return useMutation({
        mutationFn: (formData: Resigter) => register(formData),

        onSuccess: () => {

            toast.success("Register successful!");
            navigate.push("/login");
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Register failed";

            toast.error(message);
        },
    });
}

export const useLogout = () => {
    const router = useRouter();
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            await logoutApi();
        },

        onSuccess: () => {
            logout();
            router.push("/login");
        },

        onError: () => {
            toast.error("Logout failed");
        },
    });
};