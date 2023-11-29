import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import HeadPage from "./HeadPage";
const ResetPage = () => {
    const navTo = useNavigate();
    const [state, setState] = useState("");
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.[a-z])[a-zA-z-9].{8,15}$/;
    const fieldValidationSchema = yup.object({
        conformPassword: yup.string().required("Please conform password"),
        password: yup.string().required("Please enter valid password"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues: {
                conformPassword: "",
                password: "",
            },
            validationSchema: fieldValidationSchema,
            onSubmit: async (loginInfo) => {
                setState("Please wait");
                try {
                    if (loginInfo.password !== loginInfo.conformPassword) {
                        return setState("Password doesn't match");
                    }
                    if (!passwordRegex.test(loginInfo.password)) {
                        return setState(
                            "*password must contain Uppercase,lowercase,number,min-length should be 8"
                        );
                    }
                    const response = await fetch(
                        "https://url-shortner-backend-gamma.vercel.app/resetpassword",
                        {
                            method: "PUT",
                            body: JSON.stringify(loginInfo),
                            headers: {
                                "Content-Type": "application/json",
                                email: localStorage["url-short-email"],
                                "x-auth-token": localStorage["forget-password-token"],
                            },
                        }
                    );
                    const data = await response.json();
                    if (data.message === "password updated") {
                        navTo("/login");
                    } else {
                        setState(data.message);
                    }
                } catch (error) {
                    setState("Try again...");
                    console.log("Error....", error);
                }
            },
        });

    return (
        <div className="">
            <HeadPage />
            <h1>Password Reset Page</h1>
            <form className="text-start p-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="exampleInputPassword1">New Password</label>
                    <input
                        type="password"
                        className={`form-control my-2 ${touched.password && errors.password
                            ? "border-danger border-2"
                            : ""
                            }`}
                        id="password"
                        placeholder={` ${touched.password && errors.password
                            ? errors.password
                            : "New password"
                            }`}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="form-group">
                    <label for="conformPassword">Conform Password</label>
                    <input
                        type="password"
                        className={`form-control my-2 ${touched.conformPassword && errors.conformPassword
                            ? "border-danger border-2"
                            : ""
                            }`}
                        id="conformPassword"
                        placeholder={`${touched.conformPassword && errors.conformPassword
                            ? errors.conformPassword
                            : "Conform Password"
                            }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="text-center m-3">
                    <small className="text-danger">{state}</small>
                    <br />
                    <br />
                    <button type="submit" className="btn btn-success px-5">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPage;