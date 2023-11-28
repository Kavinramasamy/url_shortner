import { useFormik } from "formik";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import HeadPage from "./HeadPage";

const Forgetpassword = () => {
    const navTo = useNavigate();
    const [state, setState] = useState("");
    const fieldValidationSchema = yup.object({
        email: yup.string().required("Please enter valid email"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues: {
                email: "",
            },
            validationSchema: fieldValidationSchema,
            onSubmit: async (loginInfo) => {
                try {
                    setState("Please wait...");
                    const response = await fetch(
                        "https://short-url-backend.vercel.app/forgetpassword",
                        {
                            method: "PUT",
                            body: JSON.stringify(loginInfo),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await response.json();
                    if (data.token) {
                        localStorage.setItem("forget-password-token", data.token);
                        localStorage.setItem("url-short-email", loginInfo.email);
                        navTo("/checkmail");
                    } else {
                        setState(data.message);
                    }
                } catch (error) {
                    console.log("Error....", error);
                }
            },
        });

    return (
        <div className="">
            <HeadPage />
            <h1>Forget Password</h1>
            <form className="text-start p-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
                        className={`form-control my-2 ${touched.email && errors.email ? "border-danger border-2" : ""
                            }`}
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder={`${touched.email && errors.email ? errors.email : "Enter email"
                            }`}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="text-center m-3">
                    <button type="submit" className="btn btn-primary px-5">
                        Next
                    </button>
                </div>
            </form>
            <small className="">{state}</small>
            <div>
                <NavLink className="mb-3" to="/login">
                    back to login page
                </NavLink>
            </div>
        </div>
    );
};

export default Forgetpassword;