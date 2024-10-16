import React, { useEffect, useState } from "react";
import { SD_Categories } from "../../Utility/SD";
import inputHelper from "../../Helper/inputHelper";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateMenuItemMutation, useGetMenuItemsByIdQuery, useUpdateMenuItemMutation } from "../../Apis/MenuItemApi";
import toastNotify from "../toastNotify";
import MainLoader from "../../Components/Page/Common/MainLoader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { ResponseHandler } from "../../Helper/ResponseHandler";

const Categories = [
  SD_Categories.APPETIZER,
  SD_Categories.BEVERAGES,
  SD_Categories.DESSERT,
  SD_Categories.ENTREE,
];
const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
  image:""
};
function MenuItemUpsert() {
  const { id } = useParams();
  const {data} = useGetMenuItemsByIdQuery(id, { skip: !id });
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] =  useUpdateMenuItemMutation();
  console.log(id);

  useEffect(()=>{
    if(data && data.result){
      const tempData = {
        name : data.result.name,
        description : data.result.description,
        specialTag : data.result.specialTag,
        category : data.result.category,
        price : data.result.price,
        image : data.result.image
      };
      setMenuItemInputs(tempData);
        setImageToDisplay(process.env.REACT_APP_IMAGE_URL + data.result.image);
    }
  },[data]);


  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, menuItemInputs);
    setMenuItemInputs(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File Must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File Must be in jpeg, jpg or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
       
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!imageToStore && !id) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("Name", menuItemInputs.name);
    formData.append("Description", menuItemInputs.description);
    formData.append("SpecialTag", menuItemInputs.specialTag);
    formData.append("Category", menuItemInputs.category);
    formData.append("Price", menuItemInputs.price);
    formData.append("Image", menuItemInputs.image);
    if (imageToDisplay) formData.append("File", imageToStore);
    let response;
    if (id) {
      formData.append("id", id);
      console.log("first");
      response = await updateMenuItem({data:formData, id : id});
      console.log(response);
      ResponseHandler(response, "Menu Item Updated successfully",navigate, "/menuItem/menuitemlist");
      /*
      if (response.data?.isSuccess) {
        setLoading(false);
        navigate("/menuItem/menuitemlist");
        toastNotify("Menu Item Updated successfully", "success");
      }else if (response.data?.errorMessages){
        toastNotify(response.data.errorMessages[0] , "error");
      }else {
        toastNotify(response.data?.errorMessages?.[0] || "An unexpected error occurred", "error");
      }
      */
      setLoading(false); 
    } else {
      response = await createMenuItem(formData);
      
      ResponseHandler(response, "Menu Item created successfully",navigate,"/menuItem/menuitemlist");
      /*
      if (response.data?.isSuccess) {
        setLoading(false);
        navigate("/menuItem/menuitemlist");
        toastNotify("Menu Item created successfully", 'success');
      } else {
       const error =  response.error as  FetchBaseQueryError ;
       if ('status' in error && error.status === 403){
          toastNotify("UnAutherized", "error");
       }else{
        toastNotify(response.data?.errorMessages?.[0] || "An unexpected error occurred", "error");
       }
      } */
      setLoading(false);
    }
  };
  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">{id ? "Update" : "Add"} Menu Item</h3>
      <form method="post" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={menuItemInputs.name}
              onChange={handleMenuItemInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              name="description"
              rows={3}
              value={menuItemInputs.description}
              onChange={handleMenuItemInput}
            ></textarea>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              name="specialTag"
              value={menuItemInputs.specialTag}
              onChange={handleMenuItemInput}
            />
            <select
              className="form-control mt-3 form-select"
              name="category"
              value={menuItemInputs.category}
              onChange={handleMenuItemInput}
            >
              <option>--Category--</option>
              {Categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Enter Price"
              name="price"
              value={menuItemInputs.price}
              onChange={handleMenuItemInput}
            />
            <input type="file" onChange={handleFileChange} className="form-control mt-3"></input>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  {id ? "Update" : "Create"}
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate("/menuItem/menuitemlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToDisplay}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuItemUpsert;
