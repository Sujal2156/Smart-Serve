import { RESTAURANT_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const restaurantApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurant: builder.query({
            query: (params) => {
                if (typeof params === "string") {
                    return {
                        url: `${RESTAURANT_URL}/all`,
                        params: { keyword: params },
                    };
                }
                return {
                    url: `${RESTAURANT_URL}/all`,
                    params: params || {},
                };
            },
            keepUnusedDataFor: 5,
        }),
        getRestaurantDetails: builder.query({
            query: (restaurantId)=>({
                url: `${RESTAURANT_URL}/${restaurantId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createReview: builder.mutation({
            query: ({restaurantId, data}) => ({
                url: `${RESTAURANT_URL}/${restaurantId}/review/add`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['restaurant'], // Invalidate the cache for restaurant tag when a review is added
        }),
    }),
})

export const { useGetRestaurantQuery, useGetRestaurantDetailsQuery, useCreateReviewMutation } = restaurantApiSlice;