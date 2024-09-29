import Head from "next/head";
import { PiHandWavingThin } from "react-icons/pi";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import AdminPanelHeader from "@/components/AdminPanelHeader";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import { getAdminInfo, getAllCategories } from "../../../../public/global_functions/popular";
import { useRouter } from "next/router";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { countries } from "countries-list";
import NotFoundError from "@/components/NotFoundError";
import { FaRegPlusSquare } from "react-icons/fa";

export default function AddNewProduct() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [adminInfo, setAdminInfo] = useState({});

    const [allCategories, setAllCategories] = useState([]);

    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        discount: "",
        quantity: "",
        country: "",
        image: null,
        galleryImages: [],
    });

    const [bussinessCardCustomizations, setBussinessCardCustomizations] = useState({
        types: [
            { content: "", price: 1 }
        ],
        quantities: [
            { quantity: 1, price: 1 }
        ],
        corner: {
            type: "",
            price: 0
        },
        isExistDesign: false,
        isExistLogo: false,
        isAttachAFile: false,
        isDisplayStock: false,
    });

    const [flexCustomizations, setFlexCustomizations] = useState({
        types: [
            { content: "", price: 0 }
        ],
        dimationsDetails: [
            { width: 0, height: 0, price: 0 }
        ],
        isAttachAFile: false,
        isDisplayStock: false,
    });

    const [pannerCustomizations, setPannerCustomizations] = useState({
        types: [
            { content: "", price: 0 }
        ],
        dimationsDetails: [
            { width: 0, height: 0, price: 0 }
        ],
        isAttachAFile: false,
        isDisplayStock: false,
    });

    const [selectedCategory, setSelectedCategory] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const productImageFileElementRef = useRef();

    const productGalleryImagesFilesElementRef = useRef();

    const countryList = Object.keys(countries);

    const router = useRouter();

    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.adminTokenNameInLocalStorage);
        if (adminToken) {
            getAdminInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        await router.replace("/login");
                    } else {
                        setAdminInfo(result.data);
                        setAllCategories((await getAllCategories()).data);
                        setIsLoadingPage(false);
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

    const addNewProduct = async (e, productData) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: productData.name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "price",
                    value: productData.price,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "description",
                    value: productData.description,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "category",
                    value: productData.category,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "discount",
                    value: productData.discount,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        minNumber: {
                            value: 0,
                            msg: "Sorry, Minimum Value Can't Be Less Than Zero !!",
                        }
                    },
                },
                {
                    name: "quantity",
                    value: productData.quantity,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        minNumber: {
                            value: 0,
                            msg: "Sorry, Minimum Value Can't Be Less Than Zero !!",
                        }
                    },
                },
                {
                    name: "country",
                    value: productData.country,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "image",
                    value: productData.image,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImage: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Or WEBP Image File !!",
                        },
                    },
                },
                {
                    name: "galleryImages",
                    value: productData.galleryImages,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImages: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Or WEBP Image File !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                let formData = new FormData();
                formData.append("name", productData.name);
                formData.append("price", productData.price);
                formData.append("description", productData.description);
                formData.append("categoryId", productData.categoryId);
                formData.append("discount", productData.discount);
                formData.append("quantity", productData.quantity);
                formData.append("country", productData.country);
                formData.append("productImage", productData.image);
                console.log(bussinessCardCustomizations)
                formData.append("customizations", bussinessCardCustomizations);
                for (let galleryImage of productData.galleryImages) {
                    formData.append("galleryImages", galleryImage);
                }
                setWaitMsg("Please Wait To Add New Product ...");
                const result = (await axios.post(`${process.env.BASE_API_URL}/products/add-new-product`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        setProductData({
                            ...productData,
                            name: "",
                            price: "",
                            description: "",
                            discount: "",
                            image: null,
                            galleryImages: [],
                        });
                        productImageFileElementRef.current.value = "";
                        productGalleryImagesFilesElementRef.current.value = "";
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
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                if (err.response.data?.msg === "Sorry, Please Send Valid Discount Value !!") {
                    setErrorMsg(err.response.data.msg);
                }
                else setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const getSuitableCustomization = (selectedCategory) => {
        switch (selectedCategory) {
            case "Bussiness Card": return bussinessCardCustomizations;
            case "Flex": return flexCustomizations;
            case "Panner": return pannerCustomizations;
        }
    }

    const getTypes = (customizations) => {
        return customizations.types.map((type, typeIndex) => <div className="row align-items-center">
            <div className="col-md-5">
                <input
                    type="text"
                    className="form-control p-2 border-2 type-content-field"
                    placeholder="Please Enter Content"
                    onChange={(e) => {
                        let tempTypes = customizations.types;
                        tempTypes[typeIndex].content = e.target.value;
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: tempTypes });
                        } else if (selectedCategory === "Flex") {
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
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...bussinessCardCustomizations, types: tempTypes });
                        }
                        else if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...flexCustomizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...pannerCustomizations, types: tempTypes });
                        }
                    }}
                    value={type.price}
                />
            </div>
            <div className="col-md-1">
                <FaRegPlusSquare className="add-icon" />
            </div>
        </div>)
    }

    const getDimentionsDetailsForFlexAndPanner = (customizations) => {
        return customizations.types.map((dimentionDetailsIndex, dimentionIndex) => <div className="row align-items-center" key={dimentionIndex}>
            <div className="col-md-4">
                <input
                    type="number"
                    className="form-control p-2 border-2 width-field"
                    placeholder="Please Enter Width"
                    onChange={(e) => {
                        let tempTypes = customizations.dimationsDetails;
                        tempTypes[typeIndex].width = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...customizations, types: tempTypes });
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
                        let tempTypes = customizations.dimationsDetails;
                        tempTypes[typeIndex].height = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...customizations, types: tempTypes });
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
                        let tempTypes = customizations.dimationsDetails;
                        tempTypes[typeIndex].price = e.target.valueAsNumber ? e.target.valueAsNumber : "";
                        if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, types: tempTypes });
                        } else {
                            setPannerCustomizations({ ...customizations, types: tempTypes });
                        }
                    }}
                    value={dimentionDetailsIndex.price}
                />
            </div>
            <div className="col-md-1">
                <FaRegPlusSquare className="add-icon" />
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
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: true });
                        } else if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }}
                />
                <label htmlFor="attach-a-file-radio" className="me-4"
                    onClick={() => {
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: true });
                        } else if (selectedCategory === "Flex") {
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
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: false });
                        } else if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                />
                <label htmlFor="not-attach-a-file-radio"
                    onChange={() => {
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isAttachAFile: false });
                        } else if (selectedCategory === "Flex") {
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
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: true });
                        } else if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: true });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: true });
                        }
                    }} />
                <label htmlFor="display-stock-radio" className="me-4"
                    onChange={() => {
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: true });
                        } else if (selectedCategory === "Flex") {
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
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: false });
                        } else if (selectedCategory === "Flex") {
                            setFlexCustomizations({ ...customizations, isAttachAFile: false });
                        } else {
                            setPannerCustomizations({ ...customizations, isAttachAFile: false });
                        }
                    }}
                />
                <label htmlFor="not-display-stock-radio"
                    onChange={() => {
                        if (selectedCategory === "Bussiness Card") {
                            setBussinessCardCustomizations({ ...customizations, isDisplayStock: false });
                        } else if (selectedCategory === "Flex") {
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
        <div className="add-new-product admin-dashboard">
            <Head>
                <title>{process.env.storeName} Admin Dashboard - Add New Product</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <AdminPanelHeader isSuperAdmin={adminInfo.isSuperAdmin} />
                <div className="page-content d-flex justify-content-center align-items-center flex-column pt-5 pb-5 p-4">
                    <h1 className="fw-bold w-fit pb-2 mb-3">
                        <PiHandWavingThin className="me-2" />
                        Hi, Mr {adminInfo.firstName + " " + adminInfo.lastName} In Your Add New Product Page
                    </h1>
                    {allCategories.length > 0 ? <form className="add-new-product-form admin-dashbboard-form" onSubmit={(e) => addNewProduct(e, productData)}>
                        <section className="name mb-4">
                            <input
                                type="text"
                                className={`form-control p-2 border-2 product-name-field ${formValidationErrors["name"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Product Name"
                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                                value={productData.name}
                            />
                            {formValidationErrors["name"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["name"]}</span>
                            </p>}
                        </section>
                        <section className="price mb-4">
                            <input
                                type="number"
                                className={`form-control p-2 border-2 product-price-field ${formValidationErrors["price"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Product Price"
                                onChange={(e) => setProductData({ ...productData, price: e.target.valueAsNumber ? e.target.valueAsNumber : "" })}
                                value={productData.price}
                            />
                            {formValidationErrors["price"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["price"]}</span>
                            </p>}
                        </section>
                        <section className="description mb-4">
                            <input
                                type="text"
                                className={`form-control p-2 border-2 product-description-field ${formValidationErrors["description"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Product Description"
                                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                value={productData.description}
                            />
                            {formValidationErrors["description"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["description"]}</span>
                            </p>}
                        </section>
                        <section className="category mb-4">
                            <select
                                className={`category-select form-select p-2 border-2 category-field ${formValidationErrors["category"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => {
                                    const categoryNameAndCategoryId = e.target.value.split("-id:");
                                    setProductData({ ...productData, category: categoryNameAndCategoryId[0], categoryId: categoryNameAndCategoryId[1] })
                                    setSelectedCategory(categoryNameAndCategoryId[0]);
                                }}
                            >
                                <option defaultValue="" hidden>Please Select Your Category</option>
                                {allCategories.map((category) => (
                                    <option value={`${category.name}-id:${category._id}`} key={category._id}>{category.name}</option>
                                ))}
                            </select>
                            {formValidationErrors["category"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["category"]}</span>
                            </p>}
                        </section>
                        {["Bussiness Card", "Panner", "Flex"].includes(selectedCategory) && <section className="customizations mb-4 border border-3 border-dark p-4">
                            <h6 className="fw-bold border-bottom border-2 border-dark pb-2 mb-3">Customizations</h6>
                            <div className="type-details mb-3">
                                <h6 className="fw-bold">Types</h6>
                                {getTypes(getSuitableCustomization(selectedCategory))}
                            </div>
                            {(selectedCategory === "Flex" || selectedCategory === "Panner") && <div className="quantity-and-price-details mb-3">
                                <h6 className="fw-bold">Width, Height And Price</h6>
                                {getDimentionsDetailsForFlexAndPanner(getSuitableCustomization(selectedCategory))}
                            </div>}
                            {selectedCategory === "Bussiness Card" && <>
                                <div className="quantity-and-price-details mb-3">
                                    <h6 className="fw-bold">Quantities</h6>
                                    {bussinessCardCustomizations.quantities.map((quantityDetails, quantityIndex) => <div className="row align-items-center" key={quantityIndex}>
                                        <div className="col-md-5">
                                            <input
                                                type="number"
                                                className="form-control p-2 border-2 type-content-field"
                                                placeholder="Please Enter Quantity"
                                                onChange={(e) => {
                                                    let tempQuantities = bussinessCardCustomizations.quantities;
                                                    tempQuantities[quantityIndex].quantity = e.target.value;
                                                    setBussinessCardCustomizations({ ...bussinessCardCustomizations, quantities: tempQuantities });
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
                                                    let tempQuantities = bussinessCardCustomizations.quantities;
                                                    tempQuantities[quantityIndex].price = e.target.value;
                                                    setBussinessCardCustomizations({ ...bussinessCardCustomizations, quantities: tempQuantities });
                                                }}
                                                value={quantityDetails.price}
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <FaRegPlusSquare className="add-icon" />
                                        </div>
                                    </div>)}
                                </div>
                                <div className="corner-type mb-4">
                                    <h6 className="fw-bold mb-3">Corner Type</h6>
                                    <div className="corner-details mb-3">
                                        <input
                                            type="radio"
                                            id="rounded-corners-radio"
                                            checked={bussinessCardCustomizations.corner.type === "rounded"}
                                            className="radio-input me-2"
                                            name="cornersTypeGroup"
                                            onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, type: "rounded" } })}
                                        />
                                        <label htmlFor="rounded-corners-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, type: "rounded" } })}>Rounded</label>
                                        <input
                                            type="number"
                                            className="form-control p-2 border-2 additional-price-field mt-2"
                                            placeholder="Please Enter Price"
                                            onChange={(e) => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, price: e.target.valueAsNumber ? e.target.valueAsNumber : "" } })}
                                        />
                                    </div>
                                    <div className="corner-details">
                                        <input
                                            type="radio"
                                            id="sharp-corners-radio"
                                            checked={bussinessCardCustomizations.corner.type === "sharp"}
                                            className="radio-input me-2"
                                            name="cornersTypeGroup"
                                            onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, type: "sharp" } })}
                                        />
                                        <label htmlFor="sharp-corners-radio" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, type: "sharp" } })}>Sharp</label>
                                        <input
                                            type="number"
                                            className="form-control p-2 border-2 additional-price-field mt-2"
                                            placeholder="Please Enter Price"
                                            onChange={(e) => setBussinessCardCustomizations({ ...bussinessCardCustomizations, corner: { ...bussinessCardCustomizations.corner, price: e.target.valueAsNumber ? e.target.valueAsNumber : "" } })}
                                        />
                                    </div>
                                </div>
                                <div className="is-exist-design mb-4">
                                    <h6 className="fw-bold mb-3">Is Exist Design ?</h6>
                                    <input
                                        type="radio"
                                        checked={bussinessCardCustomizations.isExistDesign}
                                        id="exist-design-radio"
                                        className="radio-input me-2"
                                        name="isExistDesignRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistDesign: true })}
                                    />
                                    <label htmlFor="exist-design-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistDesign: true })}>Yes</label>
                                    <input
                                        type="radio"
                                        checked={!bussinessCardCustomizations.isExistDesign}
                                        id="not-exist-design-radio"
                                        className="radio-input me-2"
                                        name="isExistDesignRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistDesign: false })}
                                    />
                                    <label htmlFor="not-exist-design-radio" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistDesign: false })}>No</label>
                                </div>
                                <div className="is-exist-logo mb-4">
                                    <h6 className="fw-bold mb-3">Is Exist Logo ?</h6>
                                    <input
                                        type="radio"
                                        checked={bussinessCardCustomizations.isExistLogo}
                                        id="exist-logo-radio"
                                        className="radio-input me-2"
                                        name="isExistLogoRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistLogo: true })}
                                    />
                                    <label htmlFor="exist-logo-radio" className="me-4" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistLogo: true })}>Yes</label>
                                    <input
                                        type="radio"
                                        checked={!bussinessCardCustomizations.isExistLogo}
                                        id="not-exist-logo-radio"
                                        className="radio-input me-2"
                                        name="isExistLogoRadioGroup"
                                        onChange={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistLogo: false })}
                                    />
                                    <label htmlFor="not-exist-design-radio" onClick={() => setBussinessCardCustomizations({ ...bussinessCardCustomizations, isExistLogo: false })}>No</label>
                                </div>
                            </>}
                            {getMoreCustomizations(getSuitableCustomization(selectedCategory))}
                        </section>}
                        <section className="discount mb-4">
                            <input
                                type="number"
                                className={`form-control p-2 border-2 product-price-discount-field ${formValidationErrors["discount"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Discount"
                                onChange={(e) => setProductData({ ...productData, discount: (e.target.valueAsNumber || e.target.valueAsNumber === 0) ? e.target.valueAsNumber : "" })}
                                value={productData.discount}
                            />
                            {formValidationErrors["discount"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["discount"]}</span>
                            </p>}
                        </section>
                        <section className="quantity mb-4">
                            <input
                                type="number"
                                className={`form-control p-2 border-2 product-quantity-field ${formValidationErrors["quantity"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Quantity"
                                onChange={(e) => setProductData({ ...productData, quantity: (e.target.valueAsNumber || e.target.valueAsNumber === 0) ? e.target.valueAsNumber : "" })}
                                value={productData.quantity}
                            />
                            {formValidationErrors["quantity"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["quantity"]}</span>
                            </p>}
                        </section>
                        <section className="country mb-4">
                            <select
                                className={`country-select form-select p-2 border-2 country-field ${formValidationErrors["country"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setProductData({ ...productData, country: e.target.value })}
                            >
                                <option defaultValue="" hidden>Please Select Country</option>
                                {countryList.map((countryCode) => (
                                    <option value={countryCode} key={countryCode}>{countries[countryCode].name}</option>
                                ))}
                            </select>
                            {formValidationErrors["country"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["country"]}</span>
                            </p>}
                        </section>
                        <h6 className="mb-3 fw-bold">Please Select Product Image</h6>
                        <section className="image mb-4">
                            <input
                                type="file"
                                className={`form-control p-2 border-2 product-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Product Image"
                                onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })}
                                ref={productImageFileElementRef}
                                value={productImageFileElementRef.current?.value}
                            />
                            {formValidationErrors["image"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["image"]}</span>
                            </p>}
                        </section>
                        <h6 className="mb-3 fw-bold">Please Select Product Gallery Images</h6>
                        <section className="gallery-images mb-4">
                            <input
                                type="file"
                                className={`form-control p-2 border-2 product-galley-images-field ${formValidationErrors["galleryImages"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Product Images Gallery"
                                multiple
                                onChange={(e) => setProductData({ ...productData, galleryImages: e.target.files })}
                                value={productGalleryImagesFilesElementRef.current?.value}
                                ref={productGalleryImagesFilesElementRef}
                            />
                            {formValidationErrors["galleryImages"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["galleryImages"]}</span>
                            </p>}
                        </section>
                        {!waitMsg && !successMsg && !errorMsg && <button
                            type="submit"
                            className="btn btn-success w-50 d-block mx-auto p-2 global-button"
                        >
                            Add Now
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
                    </form> : <NotFoundError errorMsg="Sorry, Not Found Any Categories !!, Please Enter At Least One Category ..." />}
                </div>
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}