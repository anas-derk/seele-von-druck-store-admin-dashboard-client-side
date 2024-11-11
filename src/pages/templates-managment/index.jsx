import Head from "next/head";
import { useEffect, useState } from "react";
import { getAdminInfo, getAllTemplates } from "../../../public/global_functions/popular";
import AdminPanelHeader from "@/components/AdminPanelHeader";
import { PiHandWavingThin } from "react-icons/pi";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { FaRegPlusSquare, FaRegMinusSquare } from "react-icons/fa";

export default function TemplatesManagment() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [adminInfo, setAdminInfo] = useState({});

    const [allTemplates, setAllTemplates] = useState([]);

    const [selectedTemplate, setSelectedTemplate] = useState("");

    const templates = ["Flex", "Panner", "Bussiness Card"];

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
            <div className="col-md-5">
                <input
                    type="text"
                    className="form-control p-2 border-2 type-content-field"
                    placeholder="Please Enter Content"
                    onChange={(e) => {
                        let tempTypes = customizations.types;
                        tempTypes[typeIndex].content = e.target.value;
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: tempTypes });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...pannerCustomizations, types: tempTypes });
                        }
                    }}
                    value={type.content}
                />
            </div>
            <div className="col-md-6">
                <input
                    type="number"
                    className="form-control p-2 border-2 type-content-field"
                    placeholder="Please Enter Price"
                    onChange={(e) => {
                        let tempTypes = customizations.types;
                        tempTypes[typeIndex].price = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: tempTypes });
                        }
                        else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...pannerCustomizations, types: tempTypes });
                        }
                    }}
                    value={type.price}
                />
            </div>
            <div className="col-md-1">
                <FaRegPlusSquare className={`add-icon ${customizations.types.length > 1 && "mb-4"}`}
                    onClick={() => {
                        let tempTypes = customizations.types.map((type) => type);
                        tempTypes.push(
                            { content: "", price: 1 }
                        );
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: tempTypes });
                        }
                        else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...pannerCustomizations, types: tempTypes });
                        }
                    }}
                />
                {customizations.types.length > 1 && <FaRegMinusSquare className="remove-icon"
                    onClick={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: bussinessCardCustomizations.types.filter((type, index) => index !== typeIndex) });
                        }
                        else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, types: flexCustomizations.types.filter((type, index) => index !== typeIndex) });
                        } else {
                            setPannerCustomizations({ ...flexCustomizations, types: flexCustomizations.types.filter((type, index) => index !== typeIndex) });
                        }
                    }}
                />}
            </div>
        </div>)
    }

    const getDimentionsDetailsForFlexAndPanner = (customizations) => {
        return customizations.dimentionsDetails.map((dimentionDetailsIndex, dimentionIndex) => <div className="row align-items-center mb-4" key={dimentionIndex}>
            <div className="col-md-4">
                <input
                    type="number"
                    className="form-control p-2 border-2 width-field"
                    placeholder="Please Enter Width"
                    onChange={(e) => {
                        let tempDimentionsDeta = customizations.dimentionsDetails;
                        tempDimentionsDeta[typeIndex].width = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        } else {
                            setPannerCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        }
                    }}
                    value={dimentionDetailsIndex.width}
                />
            </div>
            <div className="col-md-4">
                <input
                    type="number"
                    className="form-control p-2 border-2 height-field"
                    placeholder="Please Enter Height"
                    onChange={(e) => {
                        let tempDimentionsDeta = customizations.dimentionsDetails;
                        tempDimentionsDeta[typeIndex].height = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        } else {
                            setPannerCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        }
                    }}
                    value={dimentionDetailsIndex.height}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="number"
                    className="form-control p-2 border-2 price-field"
                    placeholder="Please Enter Height"
                    onChange={(e) => {
                        let tempDimentionsDeta = customizations.dimentionsDetails;
                        tempDimentionsDeta[typeIndex].price = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        } else {
                            setPannerCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        }
                    }}
                    value={dimentionDetailsIndex.price}
                />
            </div>
            <div className="col-md-1">
                <FaRegPlusSquare className={`add-icon ${customizations.dimentionsDetails.length > 1 && "mb-4"}`}
                    onClick={() => {
                        let tempDimentionsDeta = customizations.dimentionsDetails.map((type) => type);
                        tempDimentionsDeta.push(
                            { content: "", price: 1 }
                        );
                        if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        } else {
                            setPannerCustomizations({ ...customizations, dimentionsDetails: tempDimentionsDeta });
                        }
                    }}
                />
                {customizations.dimentionsDetails.length > 1 && <FaRegMinusSquare className="remove-icon"
                    onClick={() => {
                        if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, dimentionsDetails: flexCustomizations.dimentionsDetails.filter((dimentionDetails, index) => index !== dimentionIndex) });
                        } else {
                            setPannerCustomizations({ ...flexCustomizations, dimentionsDetails: flexCustomizations.dimentionsDetails.filter((dimentionDetails, index) => index !== dimentionIndex) });
                        }
                    }}
                />}
            </div>
        </div>);
    }

    const getMoreCustomizations = (customizations) => {
        return <>
            <div className="is-attach-a-file mb-4">
                <h6 className="fw-bold mb-3">Is Attash A File ?</h6>
                <input
                    type="radio"
                    checked={customizations.isAttachAFile}
                    id="attach-a-file-radio"
                    className="radio-input me-2"
                    name="isAttachAFileRadioGroup"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: true });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }}
                />
                <label htmlFor="attach-a-file-radio" className="me-4"
                    onClick={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: true });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }}>Yes</label>
                <input
                    type="radio"
                    checked={!customizations.isAttachAFile}
                    id="not-attach-a-file-radio"
                    className="radio-input me-2"
                    name="isAttachAFileRadioGroup"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: false });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                />
                <label htmlFor="not-attach-a-file-radio"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: false });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                >No</label>
            </div>
            <div className="is-display-stock mb-4">
                <h6 className="fw-bold mb-3">Is Display Stock ?</h6>
                <input
                    type="radio"
                    checked={customizations.isDisplayStock}
                    id="display-stock-radio"
                    className="radio-input me-2"
                    name="isDisplayStockRadioGroup"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: true });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }} />
                <label htmlFor="display-stock-radio" className="me-4"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: true });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }}
                >Yes</label>
                <input
                    type="radio"
                    checked={!customizations.isDisplayStock}
                    id="not-display-stock-radio"
                    className="radio-input me-2"
                    name="isDisplayStockRadioGroup"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: false });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                />
                <label htmlFor="not-display-stock-radio"
                    onChange={() => {
                        if (selectedTemplate === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: false });
                        } else if (selectedTemplate === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                >No</label>
            </div>
        </>
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
                            {(selectedTemplate === "Flex" || selectedTemplate === "Panner") && <div className="quantity-and-price-details mb-3">
                                <h6 className="fw-bold">Width, Height And Price</h6>
                                {getDimentionsDetailsForFlexAndPanner(getSuitableCustomization(selectedTemplate))}
                            </div>}
                            {selectedTemplate === "Bussiness Card" && <>
                                <div className="quantity-and-price-details mb-3">
                                    <h6 className="fw-bold">Quantities</h6>
                                    {allTemplates[0].components.quantities.map((quantityDetails, quantityIndex) => <div className="row align-items-center mb-4" key={quantityIndex}>
                                        <div className="col-md-5">
                                            <input
                                                type="number"
                                                className="form-control p-2 border-2 type-content-field"
                                                placeholder="Please Enter Quantity"
                                                onChange={(e) => {
                                                    let tempQuantities = allTemplates[0].components.quantities;
                                                    tempQuantities[quantityIndex].quantity = e.target.value;
                                                    setBussinessCardCustomizations({ ...allTemplates[0].components, quantities: tempQuantities });
                                                }}
                                                value={quantityDetails.quantity}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="number"
                                                className="form-control p-2 border-2 type-content-field"
                                                placeholder="Please Enter Price"
                                                onChange={(e) => {
                                                    let tempQuantities = allTemplates[0].components.quantities;
                                                    tempQuantities[quantityIndex].price = e.target.value;
                                                    setBussinessCardCustomizations({ ...allTemplates[0].components, quantities: tempQuantities });
                                                }}
                                                value={quantityDetails.price}
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <FaRegPlusSquare className={`add-icon ${allTemplates[0].components.quantities.length > 1 && "mb-4"}`}
                                                onClick={() => {
                                                    let tempQuantitiesDeta = allTemplates[0].components.quantities.map((quantity) => quantity);
                                                    tempQuantitiesDeta.push({
                                                        quantity: 1,
                                                        price: 1
                                                    });
                                                    setBussinessCardCustomizations({ ...allTemplates[0].components, quantities: tempQuantitiesDeta });
                                                }}
                                            />
                                            {allTemplates[0].components.quantities.length > 1 && <FaRegMinusSquare className="remove-icon"
                                                onClick={() => {
                                                    setBussinessCardCustomizations({ ...allTemplates[0].components, quantities: allTemplates[0].components.quantities.filter((quantity, index) => index !== quantityIndex) });
                                                }}
                                            />}
                                        </div>
                                    </div>)}
                                </div>
                                <div className="corner-type mb-4">
                                    <h6 className="fw-bold mb-3">Corner Type</h6>
                                    <div className="corner-details mb-3">
                                        <input
                                            type="radio"
                                            id="rounded-corners-radio"
                                            checked={allTemplates[0].components.corner.type === "rounded"}
                                            className="radio-input me-2"
                                            name="cornersTypeGroup"
                                            onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...allTemplates[0].components.corner, type: "rounded" } })}
                                        />
                                        <label htmlFor="rounded-corners-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...bussinessCardCustomizations.corner, type: "rounded" } })}>Rounded</label>
                                        <input
                                            type="number"
                                            className="form-control p-2 border-2 additional-price-field mt-2"
                                            placeholder="Please Enter Price"
                                            onChange={(e) => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...allTemplates[0].components.corner, price: e.target.valueAsNumber ? e.target.valueAsNumber : "" } })}
                                        />
                                    </div>
                                    <div className="corner-details">
                                        <input
                                            type="radio"
                                            id="sharp-corners-radio"
                                            checked={allTemplates[0].components.corner.type === "sharp"}
                                            className="radio-input me-2"
                                            name="cornersTypeGroup"
                                            onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...allTemplates[0].components.corner, type: "sharp" } })}
                                        />
                                        <label htmlFor="sharp-corners-radio" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...allTemplates[0].components.corner, type: "sharp" } })}>Sharp</label>
                                        <input
                                            type="number"
                                            className="form-control p-2 border-2 additional-price-field mt-2"
                                            placeholder="Please Enter Price"
                                            onChange={(e) => setBussinessCardCustomizations({ ...allTemplates[0].components, corner: { ...allTemplates[0].components.corner, price: e.target.valueAsNumber ? e.target.valueAsNumber : "" } })}
                                        />
                                    </div>
                                </div>
                                <div className="is-exist-design mb-4">
                                    <h6 className="fw-bold mb-3">Is Exist Design ?</h6>
                                    <input
                                        type="radio"
                                        checked={allTemplates[0].components.isExistDesign}
                                        id="exist-design-radio"
                                        className="radio-input me-2"
                                        name="isExistDesignRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistDesign: true })}
                                    />
                                    <label htmlFor="exist-design-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistDesign: true })}>Yes</label>
                                    <input
                                        type="radio"
                                        checked={!allTemplates[0].components.isExistDesign}
                                        id="not-exist-design-radio"
                                        className="radio-input me-2"
                                        name="isExistDesignRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistDesign: false })}
                                    />
                                    <label htmlFor="not-exist-design-radio" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistDesign: false })}>No</label>
                                </div>
                                <div className="is-exist-logo mb-4">
                                    <h6 className="fw-bold mb-3">Is Exist Logo ?</h6>
                                    <input
                                        type="radio"
                                        checked={allTemplates[0].components.isExistLogo}
                                        id="exist-logo-radio"
                                        className="radio-input me-2"
                                        name="isExistLogoRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistLogo: true })}
                                    />
                                    <label htmlFor="exist-logo-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistLogo: true })}>Yes</label>
                                    <input
                                        type="radio"
                                        checked={!allTemplates[0].components.isExistLogo}
                                        id="not-exist-logo-radio"
                                        className="radio-input me-2"
                                        name="isExistLogoRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistLogo: false })}
                                    />
                                    <label htmlFor="not-exist-design-radio" onClick={() => setBussinessCardCustomizations({ ...allTemplates[0].components, isExistLogo: false })}>No</label>
                                </div>
                            </>}
                            {getMoreCustomizations(getSuitableCustomization(selectedTemplate))}
                        </section>}
                    </div>
                </div>
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    )
}