import React, { useState } from "react";
import HeadPage from "./HeadPage";

const ActivatePage = () => {
    const [show, setShow] = useState("Please wait...");
    async function activation() {
        const activationInfo = {
            email: localStorage["url-short-email"],
        };
        const response = await fetch(
            "https://url-shortner-backend-gamma.vercel.app/activation",
            {
                method: "PUT",
                body: JSON.stringify(activationInfo),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        setShow(data.message);
    }
    activation();
    return (
        <div>
            <HeadPage />
            <br />
            {show}
            <br />
            <a href="/login"> click to login page</a>
        </div>
    );
};

export default ActivatePage;