import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders: (headers: Headers, api) => {
            const token = localStorage.getItem("token");
           // console.log(token);
            token && headers.append("Authorization", "Bearer " + token);
            return headers;
        }
    }),
    tagTypes: ["ShoppingCarts"],
    endpoints: (builder) => ({
        
        updateShoppingCart: builder.mutation({
            query: ({ menuItemId, updateQuantityBy, userId }) => ({
                url: "shoppingCart",
                method: "POST",
                params :{ menuItemId, updateQuantityBy, userId }
            }),
           invalidatesTags :["ShoppingCarts"]
        }),

        getShoppingCart: builder.query({
            query: (id) => ({
                url: "shoppingCart",
                params : {userId : id}
            }),
            providesTags: ["ShoppingCarts"],
        }),
    })
})

export const {useUpdateShoppingCartMutation, useGetShoppingCartQuery} = shoppingCartApi;
export default shoppingCartApi;