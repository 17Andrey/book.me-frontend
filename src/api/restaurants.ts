import { api } from "./api";

export const getRestaurants = async (page:number) => {try {
    console.log(123)
    const response = await api.get(`/restaurants?page=${page}`);
    return response.data;
} catch (error) {
    console.log(error)
}
}