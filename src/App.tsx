import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import AccessDenied from './Pages/AccessDenied';
import AuthenticationTest from './Pages/AuthenticationTest';
import AuthenticationTestAdmin from './Pages/AuthenticationTestAdmin';
import MenuItemList from './Pages/MenuItem/MenuItemList';
import MenuItemUpsert from './Pages/MenuItem/MenuItemUpsert';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import userModel from './Interfaces/UserModel';
import { setLoggedInUser } from './Storage/Redux/userAuthSlice';
import MyOrder from './Pages/Order/MyOrder';
import MenuItemDetail from './Pages/MenuItemDetail';

import { RootState } from './Storage/Redux/store';
import { useGetShoppingCartQuery } from './Apis/ShoppingCartApi';
import { setShoppingCart } from './Storage/Redux/shoppingCartSlice';
import ShoppingCart from './Pages/ShoppingCart';

function App() {
  const dispatch = useDispatch();
  const [skip,setSkip] = useState(true);
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const {data, isLoading}  = useGetShoppingCartQuery(userData.id, {skip:skip});
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwtDecode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  useEffect(()=>{
    if(!isLoading && data){
      dispatch(setShoppingCart(data.result?.cartItems))
    }
  },[data]);

  useEffect(() => {
    if (userData.id) setSkip(false);
  }, [userData]);
  
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path="/" element={<Home />}></Route>
        <Route path='/login' element={<Login></Login>} />
        <Route path="/accessDenied" element={<AccessDenied />} />
        <Route path="/authTest" element={<AuthenticationTest />} />
        <Route path="/authTestAdmin" element={<AuthenticationTestAdmin />} />
        <Route path="/menuItem/menuitemlist" element={<MenuItemList />} />
        <Route path="/menuItem/menuitemUpsert/:id" element={<MenuItemUpsert />} />
        <Route path="/menuItem/menuItemUpsert" element={<MenuItemUpsert />} />
        <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetail />} />
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        <Route path="/order/myorders" element={<MyOrder />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
