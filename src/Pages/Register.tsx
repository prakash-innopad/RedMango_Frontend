import React, { useState } from "react";
import apiResponse from "../Interfaces/apiResponse";
import inputHelper from "../Helper/inputHelper";
import { useRegisterUserMutation } from "../Apis/AuthApi";
import { SD_Roles } from "../Utility/SD";
import toastNotify from "./toastNotify";
function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
  });
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });
    if (response.data) {
      toastNotify("Registeration successful! Please login to continue.");
      // navigate("/login");
    } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
      }
  };
  return (
    <div className="container text-center">
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control "
                placeholder="Enter UserName"
                required
                name="userName"
                value={userInput.userName}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                required
                name="name"
                value={userInput.name}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Password"
                required
                name="password"
                value={userInput.password}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <select
                className="form-control"
                required
                name="role"
                value={userInput.role}
                onChange={handleUserInput}
              >
                <option value="">--Select Role--</option>
                <option value={`${SD_Roles.CUTOMER}`}>Customer</option>
                <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              </select>
            </div>
            <div className="mt-5 col-sm-6 offset-sm-3">
              <button
                type="submit"
                className="btn btn-success  form-control"
                disabled={false}
              >
                Register
              </button>
            </div>
          
        </div>
      </form>
    </div>
  );
}

export default Register;
