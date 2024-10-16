import { configureStore } from "@reduxjs/toolkit";
import { userAuthReducer } from "./userAuthSlice";
import authApi from "../../Apis/AuthApi";
import { menuItemReducer } from "./MenuItemSlice";
import menuItemApi from "../../Apis/MenuItemApi";
import { shoppingCartReducer } from "./shoppingCartSlice";
import shoppingCartApi from "../../Apis/ShoppingCartApi";

const store = configureStore({
    reducer : {
        userAuthStore : userAuthReducer,
        menuItemStore : menuItemReducer,
        shoppingCartStore : shoppingCartReducer,
        [authApi.reducerPath] : authApi.reducer,
        [menuItemApi.reducerPath] : menuItemApi.reducer,
        [shoppingCartApi.reducerPath] :  shoppingCartApi.reducer
    },
    middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(menuItemApi.middleware)
    .concat(shoppingCartApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>

export default store;