import React from 'react'
import cartItemModel from '../../../Interfaces/cartItemModel'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Storage/Redux/store'
import { useUpdateShoppingCartMutation } from '../../../Apis/ShoppingCartApi';
import { UseDispatch } from 'react-redux';
import { removeFromCart } from '../../../Storage/Redux/shoppingCartSlice';
function CartSummary() {
    const dispatch = useDispatch();
    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
    );
    const [updateShoppingCart] = useUpdateShoppingCartMutation();
    const userData = useSelector(
        (state: RootState) => state.userAuthStore
    );
    if (shoppingCartFromStore.length == 0) {
        
        return(
            <div className='p-5'>There are no items in your cart. Please add items to continue.</div>
        );
        
    }
    const handleCount = (value : number,cartItem :cartItemModel)=>{
        if(value == 0 ){
            updateShoppingCart({ menuItemId : cartItem.menuItemId , updateQuantityBy : 0, userId : userData.id});
            dispatch(removeFromCart({cartItem}));
        }else{
            
            if((cartItem.quantity ?? 0  ) > 1 && value == -1 || value == +1 ){
            updateShoppingCart({ menuItemId :cartItem.menuItemId , updateQuantityBy : value, userId : userData.id})
            }
        }
    }
        return (
            <div className='container p-2'>
                <h4 className='text-center text-primary'>Cart Summary</h4>
                {shoppingCartFromStore.map((cartItem: cartItemModel, index: number) => (
                    <div
                        key={index}
                        className="d-flex flex-lg-row flex-column align-items-center custom-card-shadow rounded m-3"
                        style={{ background: "ghostwhite" }}
                    >
                        <div className="p-3">
                            <img
                                src={cartItem.menuItem?.image}
                                alt=""
                                width={"120px"}
                                className="rounded-circle"
                            />
                        </div>

                        <div className="p-2 mx-3 w-100" >
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className=' fw-medium'>{cartItem.menuItem?.name}</h4>
                                <h4>
                                    ${(cartItem.quantity! * cartItem.menuItem!.price).toFixed(2)}
                                </h4>
                            </div>
                            <div className="flex-fill">
                                <h4 className="text-danger">${cartItem.menuItem!.price}</h4>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div
                                    className="d-flex justify-content-between p-2 mt-2 rounded-pill custom-card-shadow w-25"
                                   
                                >
                                    <span className='text-dark opacity-75' role="button">
                                        <i
                                            className="bi bi-dash-circle-fill"
                                            onClick={()=>{ handleCount(-1,cartItem )}}
                                        ></i>
                                    </span>
                                    <span>
                                        <b>{cartItem.quantity}</b>
                                    </span>
                                    <span role="button">
                                        <i
                                            className="bi bi-plus-circle-fill"
                                            onClick={()=>{handleCount(+1,cartItem )}}
                                        ></i>
                                    </span>
                                </div>

                                <button
                                    className="btn btn-danger mx-1"
                                    onClick={()=>{ handleCount(0,cartItem )}}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    export default CartSummary;