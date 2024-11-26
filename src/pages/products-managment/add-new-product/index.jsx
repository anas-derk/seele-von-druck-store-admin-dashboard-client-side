import Head from "next/head";
import { PiHandWavingThin } from "react-icons/pi";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import AdminPanelHeader from "@/components/AdminPanelHeader";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import { getAdminInfo, getAllCategories, getAllTemplates } from "../../../../public/global_functions/popular";
import { useRouter } from "next/router";
import { HiOutlineBellAlert } from "react-icons/hi2";
import NotFoundError from "@/components/NotFoundError";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";

export default function AddNewProduct() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [adminInfo, setAdminInfo] = useState({});

    const [allTemplates, setAllTemplates] = useState([]);

    const [allCategories, setAllCategories] = useState([]);

    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        template: "",
        category: "",
        discount: "",
        tax: "",
        quantity: "",
        isDisplayStock: false,
        image: null,
        galleryImages: [],
    });

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [selectedTemplate, setSelectedTemplate] = useState("");
    
    const [formValidationErrors, setFormValidationErrors] = useState({});

    const productImageFileElementRef = useRef();

    const productGalleryImagesFilesElementRef = useRef();

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
                        setAllTemplates((await getAllTemplates()).data);
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

    const handleSelectTemplate = (e) => {
        const value = e.target.value;
        if (value) {
            const template = value.split("-");
            setSelectedTemplate(template[1]);
            setProductData({ ...productData, template: template[0] });
        } else {
            setSelectedTemplate("");
            setProductData({ ...productData, template: "" });
        }
    }

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
                formData.append("category", productData.category);
                formData.append("discount", productData.discount);
                formData.append("tax", productData.tax);
                formData.append("quantity", productData.quantity);
                formData.append("productImage", productData.image);
                for (let galleryImage of productData.galleryImages) {
                    formData.append("galleryImages", galleryImage);
                }
                setWaitMsg("Please Wait To Add New Product ...");
                const result = (await axios.post(`${process.env.BASE_API_URL}/products/add-new-product?language=${process.env.defaultLanguage}`, formData, {
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
                        <section className="template mb-4">
                            <select
                                className={`template-select form-select p-2 border-2 category-field ${formValidationErrors["template"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={handleSelectTemplate}
                            >
                                <option defaultValue="" hidden>Please Select Your Template</option>
                                {allTemplates.length > 0 && allTemplates.map((template) => (
                                    <option value={`${template._id}-${template.name}`} key={template._id}>{template.name}</option>
                                ))}
                                <option value="">No Template</option>
                            </select>
                            {formValidationErrors["template"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["template"]}</span>
                            </p>}
                        </section>
                        {selectedTemplate && <section className="customizations mb-4 border border-3 border-dark p-4">
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
                        </section>}
                        <section className="category mb-4">
                            <select
                                className={`category-select form-select p-2 border-2 category-field ${formValidationErrors["category"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => {
                                    const categoryNameAndCategoryId = e.target.value.split("-id:");
                                    setProductData({ ...productData, category: categoryNameAndCategoryId[1] })
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
                        <section className="tax mb-4">
                            <input
                                type="number"
                                className={`form-control p-2 border-2 tax-field ${formValidationErrors["tax"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder="Please Enter Tax"
                                onChange={(e) => setProductData({ ...productData, tax: (e.target.valueAsNumber || e.target.valueAsNumber === 0) ? e.target.valueAsNumber : "" })}
                                value={productData.tax}
                            />
                            {formValidationErrors["tax"] && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                <span>{formValidationErrors["tax"]}</span>
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
                        <div className="is-display-stock mb-4">
                            <h6 className="fw-bold mb-3">Is Display Stock ?</h6>
                            <div className="form-check border border-2 border-dark p-3 d-flex align-items-center">
                                <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                    id="isDisplayStock"
                                    onChange={(e) => setProductData({ ...productData, isDisplayStock: e.target.checked })}
                                    value={productData.isDisplayStock}
                                />
                                <label className="form-check-label" htmlFor="isDisplayStock" onClick={(e) => setProductData({ ...productData, isDisplayStock: e.target.checked })}>
                                    Is Display Stock
                                </label>
                            </div>
                        </div>
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