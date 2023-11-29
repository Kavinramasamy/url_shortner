import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import HeadPage from "./HeadPage";
import { useNavigate } from "react-router-dom";
const URLCreatePage = () => {
    const navTo = useNavigate();
    const [state, setState] = useState("");
    const [short, setShort] = useState("");
    const fieldValidationSchema = yup.object({
        urlName: yup.string().required("Please provide name for url"),
        long_url: yup.string().required("Please enter url"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues: {
                long_url: "",
                urlName: "",
            },
            validationSchema: fieldValidationSchema,
            onSubmit: async (urlInfo) => {
                setState("Please wait...");
                try {
                    const response = await fetch(
                        "https://url-shortner-backend-gamma.vercel.app/newshorturl",
                        {
                            method: "POST",
                            body: JSON.stringify(urlInfo),
                            headers: {
                                "Content-Type": "application/json",
                                email: localStorage["url-short-email"],
                                "x-auth-token": localStorage["url-short-token"],
                            },
                        }
                    );

                    const data = await response.json();
                    if (data.message === "success") {
                        const shortURL =
                            "https://short-url-backend.vercel.app/" + data.newUrl.short_url;
                        setShort("--Shorted URL--");
                        setState(<a href={shortURL}>{shortURL}</a>);
                    } else {
                        setState(data.message);
                    }
                } catch (error) {
                    console.log("Error....", error);
                }
            },
        });
    function handleroute() {
        navTo("/urlpage");
    }
    return (
        <div className="">
            <HeadPage />
            <form className="text-start p-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="urlName">Url name</label>
                    <input
                        type="urlName"
                        className={`form-control my-2 ${touched.urlName && errors.urlName ? "border-danger border-2" : ""
                            }`}
                        id="urlName"
                        placeholder={`${touched.urlName && errors.urlName
                            ? errors.urlName
                            : "Enter Url name"
                            }`}
                        value={values.urlName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">URL</label>
                    <input
                        type="long_url"
                        className={`form-control my-2 ${touched.long_url && errors.long_url
                            ? "border-danger border-2"
                            : ""
                            }`}
                        id="long_url"
                        placeholder={` ${touched.long_url && errors.long_url
                            ? errors.long_url
                            : "Enter long_url"
                            }`}
                        value={values.long_url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="text-center m-3">
                    {short}
                    <br />
                    <br />
                    {state}
                    <br />
                    <br />
                    {short === "" && (
                        <button type="submit" className="btn btn-success px-5">
                            Generate
                        </button>
                    )}
                </div>
            </form>
            <button className="mb-3 btn btn-warning" onClick={() => handleroute()}>
                Click to url list page
            </button>
        </div>
    );
};

export default URLCreatePage;