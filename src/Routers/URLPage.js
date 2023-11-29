import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import HeadPage from "./HeadPage";
import { Table } from "antd";

const URLPage = () => {
    const [tableColumn, setTableColumn] = useState([]);
    useEffect(() => {
        async function getUrlList() {
            try {
                const response = await fetch(
                    "https://url-shortner-backend-gamma.vercel.app/shorturl",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            email: localStorage["url-short-email"],
                            "x-auth-token": localStorage["url-short-token"],
                        },
                    }
                );
                const data = await response.json();
                if (data.message === "shorturls") {
                    const values = data.shortUrls.map((ele, idx) => {
                        return {
                            urlName: ele.urlName,
                            short_url: (
                                <a
                                    href={`https://short-url-backend.vercel.app/${ele.short_url}`}
                                >
                                    https://short-url-backend.vercel.app/{ele.short_url}
                                </a>
                            ),
                            click_count: ele.click_count,
                            key: idx,
                        };
                    });
                    setTableColumn(values);
                } else {
                    setTableColumn([]);
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUrlList();
    }, []);

    const columns = [
        {
            title: "S.No",
            dataIndex: "key",
            key: "1",
            sorter: (a, b) => {
                return a.key > b.key;
            },
        },
        {
            title: "Name",
            dataIndex: "urlName",
            key: "2",
            sorter: (a, b) => {
                return a.urlName > b.urlName;
            },
        },
        {
            title: "Link",
            dataIndex: "short_url",
            key: "3",
        },
        {
            title: "Click count",
            dataIndex: "click_count",
            key: "4",
        },
    ];

    return (
        <div>
            <HeadPage />
            <div className="container-fluid" style={{ width: "100%" }}>
                <h1>Shorted URL List</h1>
                <NavLink className="btn btn-success m-2" to="/createurlpage">
                    click to create new short url
                </NavLink>
                <div
                    className="row p-3 justify-content-between"
                >
                    {tableColumn.length === 0 && (
                        <h3 className="text-muted">NO URL HAVE CREATED</h3>
                    )}
                    <div className="">
                        {tableColumn.length > 0 && (
                            <>
                                <h4>URL List Table</h4><br />
                                <Table
                                    className=""
                                    style={{ overflowX: "auto" }}
                                    dataSource={tableColumn}
                                    columns={columns}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default URLPage;