import { api } from "./api";

export const loginApi = async (phone: string, name: string) => {try {
    console.log(123)
    const response = await api.post("/users/auth", { phone, name });
    return response.data;
} catch (error) {
    console.log(error)
}
}