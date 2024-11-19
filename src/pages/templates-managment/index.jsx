import Head from "next/head";
import { useEffect, useState } from "react";
import { getAdminInfo, getAllTemplates } from "../../../public/global_functions/popular";
import AdminPanelHeader from "@/components/AdminPanelHeader";
import { PiHandWavingThin } from "react-icons/pi";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { FaRegPlusSquare, FaRegMinusSquare } from "react-icons/fa";
import axios from "axios";

export default function TemplatesManagment() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [adminInfo, setAdminInfo] = useState({});

    const [allTemplates, setAllTemplates] = useState([]);

    const [selectedTemplate, setSelectedTemplate] = useState("");

    const templates = ["Flex", "Panner", "Bussiness Card"];

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.adminTokenNameInLocalStorage);
        if (adminToken) {
            getAdminInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        await router.replace("/login");
                    } else {
                        const adminDetails = result.data;
                        if (adminDetails.isSuperAdmin) {
                            setAdminInfo(adminDetails);
                            setAllTemplates((await getAllTemplates()).data);
                            setIsLoadingPage(false);
                        }
                        else {
                            await router.replace("/");
                        }
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else router.replace("/login");
    }, []);

    const getSuitableCustomization = (selectedTemplate) => {
        switch (selectedTemplate) {
            case "Bussiness Card": return allTemplates[0].components;
            case "Flex": return allTemplates[1].components;
            case "Panner": return allTemplates[2].components;
        }
    }

    const getTypes = (customizations) => {
        return customizations.types.map((type, typeIndex) => <div className="row align-items-center mb-4">
            <div className="col-md-11">
                <input
                    type="text"
                    className="form-control p-2 border-2 type-content-field"
                    placeholder="Please Enter Content"
                    onChange={(e) => {
                        let tempTypes = customizations.types;
                        tempTypes[typeIndex].content = e.target.value;
                        let tempTemplates = allTemplates.map((template) => template);
                        if (selectedTemplate === "Bussiness Card") {
                            tempTemplates[0].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        } else if (selectedTemplate === "Flex") {
                            tempTemplates[1].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        } else {
                            tempTemplates[2].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        }
                    }}
                    value={type.content}
                />
            </div>
            <div className="col-md-1">
                <FaRegPlusSquare className={`add-icon ${customizations.types.length > 1 && "me-4"}`}
                    onClick={() => {
                        let tempTypes = customizations.types.map((type) => type);
                        tempTypes.push(
                            { content: "" }
                        );
                        let tempTemplates = allTemplates.map((template) => template);
                        if (selectedTemplate === "Bussiness Card") {
                            tempTemplates[0].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        } else if (selectedTemplate === "Flex") {
                            tempTemplates[1].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        } else {
                            tempTemplates[2].components.types = tempTypes;
                            setAllTemplates(tempTemplates);
                        }
                    }}
                />
                {customizations.types.length > 1 && <FaRegMinusSquare className="remove-icon"
                    onClick={() => {
                        let tempTemplates = allTemplates.map((template) => template);
                        if (selectedTemplate === "Bussiness Card") {
                            tempTemplates[0].components.types = tempTemplates[0].components.types.filter((type, index) => index !== typeIndex);
                            setAllTemplates(tempTemplates);
                        } else if (selectedTemplate === "Flex") {
                            tempTemplates[1].components.types = tempTemplates[1].components.types.filter((type, index) => index !== typeIndex);
                            setAllTemplates(tempTemplates);
                        } else {
                            tempTemplates[2].components.types = tempTemplates[2].components.types.filter((type, index) => index !== typeIndex);
                            setAllTemplates(tempTemplates);
                        }
                    }}
                />}
            </div>
        </div>)
    }

    const getSuitableTemplate = (selectedTemplate) => {
        switch (selectedTemplate) {
            case "Bussiness Card": return allTemplates[0];
            case "Flex": return allTemplates[1];
            case "Panner": return allTemplates[2];
        }
    }

    const updateTemplate = async (template) => {
        try {
            setWaitMsg("Please Waiting To Update Template ...");
            const result = (await axios.put(`${process.env.BASE_API_URL}/templates/${template._id}?language=${process.env.defaultLanguage}`, {
                components: template.components
            }, {
                headers: {
                    Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg(result.msg);
                let successTimeout = setTimeout(() => {
                    setSuccessMsg("");
                    clearTimeout(successTimeout);
                }, 1500);
            } else {
                setErrorMsg(result.msg);
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="templates-managment admin-dashboard">
            <Head>
                <title>{process.env.storeName} Admin Dashboard - Templates Managment</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <AdminPanelHeader isSuperAdmin={adminInfo.isSuperAdmin} />
                <div className="page-content d-flex justify-content-center align-items-center flex-column text-center pt-5 pb-5">
                    <div className="container-fluid">
                        <h1 className="welcome-msg mb-4 fw-bold pb-3 mx-auto">
                            <PiHandWavingThin className="me-2" />
                            Hi, Mr {adminInfo.firstName + " " + adminInfo.lastName} In Your Templates Managment Page
                        </h1>
                        <section className="filters mb-3 bg-white border-3 border-info p-3 text-start w-100">
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <h6 className="me-2 fw-bold text-center">Templates</h6>
                                    <select
                                        className="select-template form-select"
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                    >
                                        <option value="" hidden>Pleae Select Template</option>
                                        {templates.map((template) => (
                                            <option value={template} key={template}>{template}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>
                        {templates.includes(selectedTemplate) && <section className="customizations mb-4 border border-3 border-dark p-4">
                            <h6 className="fw-bold border-bottom border-2 border-dark pb-2 mb-3">Customizations</h6>
                            <div className="type-details mb-3">
                                <h6 className="fw-bold">Types</h6>
                                {getTypes(getSuitableCustomization(selectedTemplate))}
                            </div>
                            <hr />
                            {selectedTemplate === "Bussiness Card" && <>
                                <div className="quantity-and-price-details mb-3">
                                    <h6 className="fw-bold">Quantities</h6>
                                    {allTemplates[0].components.quantities.map((quantityDetails, quantityIndex) => <div className="row align-items-center mb-4" key={quantityIndex}>
                                        <div className="col-md-5">
                                            <h6 className="fw-bold">Quantity</h6>
                                            <input
                                                type="number"
                                                className="form-control p-2 border-2 type-content-field"
                                                placeholder="Please Enter Quantity"
                                                onChange={(e) => {
                                                    let tempQuantities = allTemplates[0].components.quantities;
                                                    tempQuantities[quantityIndex].quantity = e.target.value;
                                                    let tempTemplates = allTemplates.map((template) => template);
                                                    tempTemplates[0].components.quantities = tempQuantities;
                                                    setAllTemplates(tempTemplates);
                                                }}
                                                value={quantityDetails.quantity}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Price</h6>
                                            <input
                                                type="number"
                                                className="form-control p-2 border-2 type-content-field"
                                                placeholder="Please Enter Price"
                                                onChange={(e) => {
                                                    let tempQuantities = allTemplates[0].components.quantities;
                                                    tempQuantities[quantityIndex].price = e.target.value;
                                                    let tempTemplates = allTemplates.map((template) => template);
                                                    tempTemplates[0].components.quantities = tempQuantities;
                                                    console.log(tempTemplates[0].components)
                                                    setAllTemplates(tempTemplates);
                                                }}
                                                value={quantityDetails.price}
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <FaRegPlusSquare className={`add-icon ${allTemplates[0].components.quantities.length > 1 && "me-4"}`}
                                                onClick={() => {
                                                    let tempQuantitiesDeta = allTemplates[0].components.quantities.map((quantity) => quantity);
                                                    tempQuantitiesDeta.push({
                                                        quantity: 1,
                                                        price: 1
                                                    });
                                                    let tempTemplates = allTemplates.map((template) => template);
                                                    tempTemplates[0].components.quantities = tempQuantitiesDeta;
                                                    setAllTemplates(tempTemplates);
                                                }}
                                            />
                                            {allTemplates[0].components.quantities.length > 1 && <FaRegMinusSquare className="remove-icon"
                                                onClick={() => {
                                                    let tempTemplates = allTemplates.map((template) => template);
                                                    tempTemplates[0].components.quantities = tempTemplates[0].components.quantities.filter((quantity, index) => index !== quantityIndex);
                                                    setAllTemplates(tempTemplates);
                                                }}
                                            />}
                                        </div>
                                    </div>)}
                                </div>
                            </>}
                            {!waitMsg && !successMsg && !errorMsg && <button
                                type="button"
                                className="btn btn-success w-50 d-block mx-auto p-2 global-button"
                                onClick={() => updateTemplate(getSuitableTemplate(selectedTemplate))}
                            >
                                Update
                            </button>}
                            {waitMsg && <button
                                type="button"
                                className="btn btn-danger w-50 d-block mx-auto p-2 global-button"
                                disabled
                            >
                                {waitMsg}
                            </button>}
                            {errorMsg && <button
                                type="button"
                                className="btn btn-danger w-50 d-block mx-auto p-2 global-button"
                                disabled
                            >
                                {errorMsg}
                            </button>}
                            {successMsg && <button
                                type="button"
                                className="btn btn-success w-75 d-block mx-auto p-2 global-button"
                                disabled
                            >
                                {successMsg}
                            </button>}
                        </section>}
                    </div>
                </div>
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    )
}