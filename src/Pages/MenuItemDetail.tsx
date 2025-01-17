import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetMenuItemsByIdQuery } from '../Apis/MenuItemApi';
import MainLoader from '../Components/Page/Common/MainLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../Storage/Redux/store';
import userModel from '../Interfaces/UserModel';
import apiResponse from '../Interfaces/apiResponse';
import { useUpdateShoppingCartMutation } from '../Apis/ShoppingCartApi';
import toastNotify from './toastNotify';
import MiniLoader from '../Components/Page/Common/MiniLoader';

function MenuItemDetail() {
    const { menuItemId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetMenuItemsByIdQuery(menuItemId);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const userData: userModel = useSelector((state: RootState) => state.userAuthStore)
    const [updateShoppingCart] = useUpdateShoppingCartMutation();
    const handleQuantity = (counter: number) => {
        let newQuantity = quantity + counter;
        if (newQuantity == 0) {
            newQuantity = 1;
        }
        setQuantity(newQuantity);
        return;
    }
    const handleAddToCart = async (id: number) => {
        if (!userData.id) {
            navigate("/login");
            return;
        }
        setIsAddingToCart(true);
        const response: apiResponse = await updateShoppingCart({
            menuItemId: id,
            updateQuantityBy: quantity,
            userId: userData.id
        })
        if (response.data && response.data.isSuccess) {
            toastNotify("Item added to cart successfully!");
        }
        setIsAddingToCart(false);
    }
    return (
        <div className='container pt-4'>
            {!isLoading ? (
                <div className='row'>
                    <div className='col-7'>
                        <h2 className='text-danger'>{data.result.name}</h2>
                        <span>
                            <span className='badge text-bg-dark pt-2' style={{ height: "40px", fontSize: "20px" }}>
                                {data.result?.category}
                            </span>
                        </span>
                        <span>
                            <span className='badge text-bg-light pt-2' style={{ height: "40px", fontSize: "20px" }}>
                                {data.result?.specialTag}
                            </span>
                        </span>
                        <p style={{ fontSize: "20px" }} className='pt-2'>
                            {data.result?.description}
                        </p>
                        <span className="h3">{data.result?.price}</span>&nbsp;&nbsp;&nbsp;
                        <span className='pb-2 p-3' style={{ border: "1px solid #333", borderRadius: "30px" }}>
                            <i style={{ fontSize: "25px", cursor: "pointer" }}
                                onClick={() => {
                                    handleQuantity(-1);
                                }}
                                className="bi bi-dash p-1"></i>
                            <span className="h3 mt-3 px-3">{quantity}</span>
                            <i className="bi bi-plus p-1" style={{ fontSize: "25px", cursor: "pointer" }}
                                onClick={() => {
                                    handleQuantity(+1);
                                }}></i>
                        </span>
                        <div className='row pt-4'>
                            <div className='col-5'>
                                {isAddingToCart ? (
                                    <button disabled className="btn btn-success form-control">
                                        <MiniLoader />
                                    </button>
                                ) : (
                                    <button className="btn btn-success form-control"
                                        onClick={() => handleAddToCart(data.result?.id)} >
                                        Add to Cart
                                    </button>)}
                            </div>
                            <div className="col-5 ">
                                <button className="btn btn-secondary form-control"
                                    onClick={() => navigate(-1)} >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<div
                className="d-flex justify-content-center"
                style={{ width: "100%" }}
            >
                <MainLoader />
            </div>)}
        </div>
    )
}

export default MenuItemDetail