import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '../../Apis/MenuItemApi';
import menuItemModel from "../../Interfaces/menuItemModel";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import MainLoader from '../../Components/Page/Common/MainLoader';
import apiResponse from '../../Interfaces/apiResponse';
function MenuItemList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMenuItemsQuery(null);
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const handleMenuItemDelete = async (id: Number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        toast.promise(
          deleteMenuItem(id).unwrap().then((response) => {
            if (!response.isSuccess) {
             // throw new Error(response?.errorMessages?.[0] || "Unknown error");
            }
            return response;
          }),
          {
            pending: "Processing your request...",
            success: "Menu Item Deleted Successfully 👌",
            error: {
              render({ data }: { data :any }) {
                if(data?.status == 403)
                  return  "Unautherized";
                return data.message || "Error encountered 🤯";  // Show error message
              },
            }
          },
          {
            theme: "dark",
          }
        );
      }
    });
  }
    return (
      <>
        {isLoading && <MainLoader />}
        {!isLoading && (
          <div className="table p-5">
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="text-success">MenuItem List</h1>

              <button
                className="btn btn-success"
                onClick={() => navigate("/menuitem/menuitemupsert")}
              >
                Add New Menu Item
              </button>
            </div>

            <div className="p-2">
              <div className="row border">
                <div className="col-1">Image</div>
                <div className="col-1">ID</div>
                <div className="col-2">Name</div>
                <div className="col-2">Category</div>
                <div className="col-1">Price</div>
                <div className="col-2">Special Tag</div>
                <div className="col-2">Action</div>
              </div>
              {data?.result.map((menuItem: menuItemModel) => {
                return (
                  <div className='row border' key={menuItem.id}>
                    <div className='col-1'><img src={'https://localhost:44322/images/' + menuItem.image} alt="Menu Image"
                      style={{ width: "100%", maxWidth: "120px" }}></img></div>
                    <div className='col-1'>{menuItem.id}</div>
                    <div className='col-2'>{menuItem.name}</div>
                    <div className='col-2'>{menuItem.category}</div>
                    <div className='col-1'>{menuItem.price}</div>
                    <div className='col-2'>{menuItem.specialTag}</div>
                    <div className='col-2'>
                      <button className='btn btn-success'>
                        <i
                          className="bi bi-pencil-fill"
                          onClick={() =>
                            navigate("/menuitem/menuitemupsert/" + menuItem.id)
                          }
                        ></i>
                      </button>
                      <button className='btn btn-danger mx-2' onClick={() => handleMenuItemDelete(menuItem.id)}>
                        <i className='bi bi-pencil-fill'></i>
                      </button>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        )}
      </>
    )
  }

  export default MenuItemList