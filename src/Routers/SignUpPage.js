import { useFormik } from "formik";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import HeadPage from "./HeadPage";

const SignUpPage = () => {
    const navTo = useNavigate();
    const [passwordState, setPasswordState] = useState("");
    const [signup_response, setResponse] = useState("");
    const fieldValidationSchema = yup.object({
        userName: yup.string().required("Please enter valid username"),
        email: yup.string().required("Please enter valid email"),
        password: yup.string().required("Please enter valid password"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues: {
                userName: "",
                email: "",
                password: "",
            },
            validationSchema: fieldValidationSchema,
            onSubmit: async (signUpInfo) => {
                setResponse("Please wait....");
                localStorage.setItem("url-short-email", signUpInfo.email);
                try {
                    const response = await fetch(
                        "https://url-shortner-backend-gamma.vercel.app/signup",
                        {
                            method: "POST",
                            body: JSON.stringify(signUpInfo),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await response.json();

                    if (data.message === "Check your mail for activation link") {
                        setResponse("");
                        navTo("/checkmail");
                    } else {
                        setResponse(data.message);
                    }
                } catch (error) {
                    setResponse("Try Again...");
                    console.log("Error....", error);
                }
            },
        });
    function testPassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-8])(?=.[a-z])[a-zA-z-8].{8,15}$/;
        if (passwordRegex.test(password)) {
            values.password = password;
            setPasswordState("");
        } else {
            values.password = "";
            setPasswordState(
                "*password must contain Uppercase,lowercase,number,min-length should be 8"
            );
        }
    }

    return (
        <div className="">
            <HeadPage />
            <h1>SignUp Page</h1>
            <form className="text-start p-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="exampleInputEmail1">Username</label>
                    <input
                        type="userName"
                        className={`form-control my-2 ${touched.userName && errors.userName
                            ? "border-danger border-2"
                            : ""
                            }`}
                        id="userName"
                        aria-describedby="usernameHelp"
                        placeholder={`${touched.userName && errors.userName
                            ? errors.userName
                            : "Enter username"
                            }`}
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
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
                <div className="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        className={`form-control my-2 ${touched.password && errors.password
                            ? "border-danger border-2"
                            : ""
                            }`}
                        id="password"
                        placeholder={` ${touched.password && errors.password
                            ? errors.password
                            : "Enter password"
                            }`}
                        onChange={(e) => testPassword(e.target.value)}
                        onBlur={handleBlur}
                    />
                    <small className="text-danger">{passwordState}</small>
                </div>
                <div className="text-center m-3">
                    <button type="submit" className="btn btn-success px-5">
                        SignUp
                    </button>
                </div>
            </form>
            <div>
                <span className="text-danger">{signup_response}</span>
                <br />
                <NavLink className="mb-3" to="/forgetpassword">
                    Forget Password
                </NavLink>
                <br />
                <NavLink className="mb-3" to="/login">
                    LogIn
                </NavLink>
            </div>
        </div>
    );
};

export default SignUpPage;