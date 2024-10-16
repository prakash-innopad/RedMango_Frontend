import React from "react";
import menuItemModel from "../../../Interfaces/menuItemModel";
import userModel from "../../../Interfaces/UserModel";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import apiResponse from "../../../Interfaces/apiResponse";
import { useUpdateShoppingCartMutation } from "../../../Apis/ShoppingCartApi";
import toastNotify from "../../../Pages/toastNotify";
interface Props {
  menuItem: menuItemModel;
  // user? :userModel
}
function MenuItemCard(props: Props) {
   const navigate =  useNavigate();
   const [updateShoppingCart] = useUpdateShoppingCartMutation();
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
      );
    const handleAddToCart = async (menuItemId : number)=>{
        if(!userData.id){
            navigate("/login");
            return;
        }
        const response : apiResponse = await updateShoppingCart({
          menuItemId : menuItemId,
          updateQuantityBy : 1,
          userId  : userData.id
        })
        if (response.data && response.data?.isSuccess){
          toastNotify("Itme added to cart successfully.");
        }else{
          toastNotify("Something went wrong.", "error");
        }
    }
  return (
    <div className="col-md-4 col-12 p-4">
      <div className="card">
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/menuitemDetails/${props.menuItem.id}`} >
            <img src={props.menuItem.image} style={{ borderRadius: "50%" }} alt="" className="w-100 mt-5 image-box"/>
            </Link>
          </div>
          {props.menuItem.specialTag && props.menuItem.specialTag.length > 0 && (
            <i  className="bi bi-star btn btn-success" style={{position: "absolute",top: "15px",left: "15px",padding: "5px 10px",borderRadius: "3px",outline: "none !important",cursor: "pointer"}}>
             &nbsp; {props.menuItem.specialTag}
            </i>
          )}
           <i className="bi bi-cart-plus btn btn-outline-warning" style={{position: "absolute",top: "15px",right: "15px",padding: "5px 10px",borderRadius: "3px",outline: "none !important",cursor: "pointer",}}
              onClick={() => handleAddToCart(props.menuItem.id)}
            ></i>

<div className="text-center">
            <p className="card-title m-0 fs-3">
              <Link to={`/menuItemDetails/${props.menuItem.id}`} style={{ textDecoration: "none" ,color :"red" }}>
                {props.menuItem.name}
              </Link>
            </p>
            <p className="badge bg-secondary" style={{ fontSize: "12px" }}>
              {props.menuItem.category}
            </p>
          </div>

          <p className="card-text" style={{ textAlign: "center",fontWeight: "light",fontSize: "14px",}}>
            {props.menuItem.description}
          </p>
          <div className="text-center">
            <h4>${props.menuItem.price}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
