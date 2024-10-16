import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders: (headers: Headers, api) => {
            const token = localStorage.getItem("token");
           // console.log(token);
            token && headers.append("Authorization", "Bearer " + token);
            return headers;
        }
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({
        getMenuItems: builder.query({
            query: () => ({
                url: "menuitem",
            }),
            providesTags: ["MenuItems"],
        }),
        getMenuItemsById: builder.query({
            query: (id) => ({
                url: `menuItem/${id}`,
            }),
            providesTags: ["MenuItems"],
        }),
        CreateMenuItem: builder.mutation({
            query: (data) => ({
                url: "menuItem/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MenuItems"],
        }),
        UpdateMenuItem: builder.mutation({
            query: ({ data, id }) => ({
                url: "menuItem/" + id,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["MenuItems"]
        }),

        deleteMenuItem: builder.mutation({
            query: (id) => ({
                url: "menuItem/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItems"],
        }),
    })
})

export const { useGetMenuItemsQuery, useCreateMenuItemMutation, useDeleteMenuItemMutation, useGetMenuItemsByIdQuery, useUpdateMenuItemMutation } = menuItemApi;
export default menuItemApi;