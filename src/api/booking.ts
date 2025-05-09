import { api } from "./api";

interface Booking {time: string, date: string, guests: number, userId: number, restaurantId: number}

export const createBooking = async (data:Booking) => {try {
    const response = await api.post("/bookings", { data });
    return response.data;
} catch (error) {
    console.log(error)
}
}

export const getBookings = async (userId:string) => {try {
    const response = await api.get("/bookings?userId=" + userId );
    return response.data;
} catch (error) {
    console.log(error)
}
}

export const deleteBookings = async (bookingId:string) => {try {
    const response = await api.delete("/bookings/" + bookingId );
    return response.data;
} catch (error) {
    console.log(error)
}
}