import apiResponse from "../Interfaces/apiResponse";
import toastNotify from "../Pages/toastNotify";
import { useNavigate } from "react-router-dom";

export const ResponseHandler = (response : apiResponse, successMessage : string,navigate ?: (path: string) => void,  navigateTo? : string)=>
{
   // const navigate = useNavigate();
    if (response.data?.isSuccess) {
        toastNotify(successMessage, "success");
        if (navigate && navigateTo) {
            navigate(navigateTo);
          }
      } else {
        const error = response.error;
        if (error && 'status' in error && error.status === 403) {
          toastNotify("UnAuthorized", "error");
        } else {
          toastNotify(response.data?.errorMessages?.[0] || "An unexpected error occurred", "error");
        }
      }
}

export const Errorhandler = (response : apiResponse)=>{
  if(response.error){
    const error = response.error;
    if (error && 'status' in error && error.status === 403) {
      if(error.status === 403)
      toastNotify("UnAuthorized", "error");
   //   if(error.status === )
    } else {
      toastNotify(response.data?.errorMessages?.[0] || "An unexpected error occurred", "error");
    }
  }
}