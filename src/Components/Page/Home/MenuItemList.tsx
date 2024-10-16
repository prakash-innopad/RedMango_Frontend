import React, { useEffect, useState } from "react";
import { useGetMenuItemsQuery } from "../../../Apis/MenuItemApi";
import menuItemModel from "../../../Interfaces/menuItemModel";
import MenuItemCard from "./MenuItemCard";
import { SD_SortTypes } from "../../../Utility/SD";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import MainLoader from "../Common/MainLoader";
import { setMenuItem } from "../../../Storage/Redux/MenuItemSlice";
import { useNavigate } from "react-router-dom";
import toastNotify from "../../../Pages/toastNotify";
function MenuItemList() {
  const { data, isLoading } = useGetMenuItemsQuery(null);
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const [categoryList, setCategoryList] = useState([""]);
  const [selectedCatgory, setSelectedCategory] = useState("All");
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];
  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );
  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFilters(
        sortName,
        selectedCatgory,
        searchValue
      );
      setMenuItems(tempMenuArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      //dispatch(setMenuItem(data.result));
      if (data?.isSuccess) {
        setMenuItems(data.result);
       
      }else if (data?.errorMessages){
        toastNotify(data.errorMessages[0] , "error");
        
      }else {
        toastNotify(data?.errorMessages?.[0] || "An unexpected error occurred", "error");
      }
      const tempCategoryList = ["All"];
      data?.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  const handleSortClick = (index: number) => {
    setSortName(sortOptions[index]);
    const tempArray = handleFilters (
      sortOptions[index],
      selectedCatgory,
      searchValue
    );
    setMenuItems(tempArray);
  };
  
  const handleCategoryClick = (i: number) => {
    console.log(i);
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategory(localCategory);
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  const handleFilters = ( sortType : SD_SortTypes, category : string, search : string) =>{
    if(data){
    let tempArray = category === "All" ? [...data.result] 
    : data.result.filter((item :menuItemModel )=> item.category.toUpperCase() === category.toUpperCase());
   
    // search 
    if (search){
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item : menuItemModel)=> item.name.toUpperCase().includes(search.toUpperCase()));
    }

    //sort
    if(sortType == SD_SortTypes.PRICE_HIGH_LOW){
      tempArray.sort((menu1 : menuItemModel, menu2 : menuItemModel)=> menu2.price - menu1.price);
    }
    if(sortType == SD_SortTypes.PRICE_LOW_HIGH){
      tempArray.sort((menu1 : menuItemModel, menu2 : menuItemModel)=> menu1.price - menu2.price);
    }
    if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort((menu1 : menuItemModel, menu2 : menuItemModel)=>
        menu1.name.toUpperCase().charCodeAt(0) - menu2.name.toUpperCase().charCodeAt(0));
    }
    if (sortType === SD_SortTypes.NAME_Z_A) {
      tempArray.sort((menu1 : menuItemModel, menu2 : menuItemModel)=>
        menu2.name.toUpperCase().charCodeAt(0) - menu1.name.toUpperCase().charCodeAt(0));
    }
    return tempArray;
  }
  }
  if (isLoading ) {
    return <MainLoader />;
  }

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li
              className="nav-item px-2"
              style={{ ...(index === 0 && { marginLeft: "auto" }) }}
              key={index}
            >
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                } `}
                onClick={() => handleCategoryClick(index)}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSortClick(index)}
                >
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <div className="row">
        {menuItems.map((menuItem: menuItemModel, index: number) => (
          <MenuItemCard menuItem={menuItem} key={index}></MenuItemCard>
        ))}
      </div>
    </div>
  );
}

export default MenuItemList;
