import Head from "next/head";
import { PiHandWavingThin } from "react-icons/pi";
import { useEffect, useState } from "react";
import axios from "axios";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import AdminPanelHeader from "@/components/AdminPanelHeader";
import { useRouter } from "next/router";
import PaginationBar from "@/components/PaginationBar";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import { getAdminInfo } from "../../../../public/global_functions/popular";
import NotFoundError from "@/components/NotFoundError";
import TableLoader from "@/components/TableLoader";

export default function UpdateAndDeletePreviousProjects() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [adminInfo, setAdminInfo] = useState({});

    const [isGetPreviousProjects, setIsGetPreviousProjects] = useState(false);

    const [allPreviousProjectsInsideThePage, setAllPreviousProjectsInsideThePage] = useState([]);

    const [selectedBrandImageIndex, setSelectedBrandImageIndex] = useState(-1);

    const [selectedProjectIndex, setSelectedProjectIndex] = useState(-1);

    const [waitChangePreviousProjectsImageMsg, setWaitChangePreviousProjectsImageMsg] = useState(false);

    const [errorChangePreviousProjectsImageMsg, setErrorChangePreviousProjectsImageMsg] = useState("");

    const [successChangePreviousProjectsImageMsg, setSuccessChangePreviousProjectsImageMsg] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetProviousProjectsData, setErrorMsgOnGetProviousProjectsData] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();

    const pageSize = 10;

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
                        result = await getPreviousProjectsCount();
                        if (result.data > 0) {
                            setAllPreviousProjectsInsideThePage((await getAllPreviousProjectsInsideThePage(1, pageSize)).data);
                            setTotalPagesCount(Math.ceil(result.data / pageSize));
                        }
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

    const getPreviousProjectsCount = async (filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/previous-projects/previous-projects-count?language=${process.env.defaultLanguage}&${filters ? filters : ""}`)).data;
        }
        catch (err) {
            throw err;
        }
    }

    const getAllPreviousProjectsInsideThePage = async (pageNumber, pageSize, filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/previous-projects/all-previous-projects-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${process.env.defaultLanguage}&${filters ? filters : ""}`)).data;
        }
        catch (err) {
            throw err;
        }
    }

    const getPreviousPage = async () => {
        try {
            setIsGetPreviousProjects(true);
            setErrorMsgOnGetProviousProjectsData("");
            const newCurrentPage = currentPage - 1;
            setAllPreviousProjectsInsideThePage((await getAllPreviousProjectsInsideThePage(newCurrentPage, pageSize, getFilteringString(filters))).data);
            setCurrentPage(newCurrentPage);
            setIsGetPreviousProjects(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetProviousProjectsData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetPreviousProjects(true);
            setErrorMsgOnGetProviousProjectsData("");
            const newCurrentPage = currentPage + 1;
            setAllPreviousProjectsInsideThePage((await getAllPreviousProjectsInsideThePage(newCurrentPage, pageSize, getFilteringString(filters))).data);
            setCurrentPage(newCurrentPage);
            setIsGetPreviousProjects(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetProviousProjectsData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetPreviousProjects(true);
            setErrorMsgOnGetProviousProjectsData("");
            setAllPreviousProjectsInsideThePage((await getAllPreviousProjectsInsideThePage(pageNumber, pageSize, getFilteringString(filters))).data);
            setCurrentPage(pageNumber);
            setIsGetPreviousProjects(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetProviousProjectsData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const changeProjectData = (projectIndex, fieldName, newValue) => {
        setSelectedBrandImageIndex(-1);
        setSelectedProjectIndex(-1);
        let projectDataTemp = allPreviousProjectsInsideThePage;
        projectDataTemp[projectIndex][fieldName] = newValue;
        setAllPreviousProjectsInsideThePage(projectDataTemp);
    }

    const changeProjectImage = async (projectIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "image",
                    value: allPreviousProjectsInsideThePage[projectIndex].image,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImage: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Image File !!",
                        },
                    },
                },
            ]);
            setSelectedBrandImageIndex(projectIndex);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitChangePreviousProjectsImageMsg("Please Wait To Change Image ...");
                let formData = new FormData();
                formData.append("projectImage", allPreviousProjectsInsideThePage[projectIndex].image);
                const result = (await axios.put(`${process.env.BASE_API_URL}/previous-projects/change-project-image/${allPreviousProjectsInsideThePage[projectIndex]._id}?language=${process.env.defaultLanguage}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                    }
                })).data;
                if (!result.error) {
                    setWaitChangePreviousProjectsImageMsg("");
                    setSuccessChangePreviousProjectsImageMsg("Change Image Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessChangePreviousProjectsImageMsg("");
                        setSelectedBrandImageIndex(-1);
                        setAllPreviousProjectsInsideThePage((await getAllPreviousProjectsInsideThePage(currentPage, pageSize)).data);
                        clearTimeout(successTimeout);
                    }, 1500);
                }
                else {
                    setWaitChangePreviousProjectsImageMsg(false);
                    setErrorChangePreviousProjectsImageMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorChangePreviousProjectsImageMsg("");
                        setSelectedBrandImageIndex(-1);
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
                setWaitChangePreviousProjectsImageMsg(false);
                setErrorChangePreviousProjectsImageMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorChangePreviousProjectsImageMsg("");
                    setSelectedBrandImageIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const updateProjectInfo = async (projectIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "description",
                    value: allPreviousProjectsInsideThePage[projectIndex].description,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedProjectIndex(projectIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait To Updating ...");
                const result = (await axios.put(`${process.env.BASE_API_URL}/previous-projects/${allPreviousProjectsInsideThePage[projectIndex]._id}?language=${process.env.defaultLanguage}`, {
                    newProjectDescription: allPreviousProjectsInsideThePage[projectIndex].description,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                    }
                })).data;
                setWaitMsg("");
                console.log(result.msg)
                if (!result.error) {
                    setSuccessMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        setSelectedProjectIndex(-1);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedProjectIndex(-1);
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
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedProjectIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteProject = async (projectIndex) => {
        try {
            setWaitMsg("Please Wait To Deleting ...");
            setSelectedProjectIndex(projectIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/previous-projects/${allPreviousProjectsInsideThePage[projectIndex]._id}?language=${process.env.defaultLanguage}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                }
            })).data;
            console.log(result)
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedProjectIndex(-1);
                    setAllPreviousProjectsInsideThePage(allPreviousProjectsInsideThePage.filter((brand, index) => index !== projectIndex));
                    clearTimeout(successTimeout);
                }, 1500);
            } else {
                setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedProjectIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
        catch (err) {
            console.log(err)
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedProjectIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="update-and-delete-previous-projects admin-dashboard">
            <Head>
                <title>{process.env.storeName} Admin Dashboard - Update / Delete Brands</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <AdminPanelHeader isSuperAdmin={adminInfo.isSuperAdmin} />
                <div className="page-content d-flex justify-content-center align-items-center flex-column p-5">
                    <h1 className="fw-bold w-fit pb-2 mb-4">
                        <PiHandWavingThin className="me-2" />
                        Hi, Mr {adminInfo.firstName + " " + adminInfo.lastName} In Your Update / Delete Previous Projects Page
                    </h1>
                    {allPreviousProjectsInsideThePage.length > 0 && !isGetPreviousProjects && <section className="previous-projects-box admin-dashbboard-data-box w-100">
                        <table className="previous-projects-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Processes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPreviousProjectsInsideThePage.map((project, projectIndex) => (
                                    <tr key={project._id}>
                                        <td className="project-description-cell">
                                            <section className="project-description mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enter New Project Description"
                                                    defaultValue={project.description}
                                                    className={`form-control d-block mx-auto p-2 border-2 project-description-field ${formValidationErrors["description"] && projectIndex === selectedProjectIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    onChange={(e) => changeProjectData(projectIndex, "description", e.target.value.trim())}
                                                ></input>
                                                {formValidationErrors["description"] && projectIndex === selectedProjectIndex && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                                    <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                                    <span>{formValidationErrors["description"]}</span>
                                                </p>}
                                            </section>
                                        </td>
                                        <td className="project-image-cell">
                                            <img
                                                src={`${process.env.BASE_API_URL}/${project.imagePath}`}
                                                alt={`${project.description} Project Image !!`}
                                                width="100"
                                                height="100"
                                                className="d-block mx-auto mb-4"
                                            />
                                            <section className="project-image mb-4">
                                                <input
                                                    type="file"
                                                    className={`form-control d-block mx-auto p-2 border-2 brand-image-field ${formValidationErrors["image"] && projectIndex === selectedBrandImageIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    onChange={(e) => changeProjectData(projectIndex, "image", e.target.files[0])}
                                                    accept=".png, .jpg, .webp"
                                                />
                                                {formValidationErrors["image"] && projectIndex === selectedBrandImageIndex && <p className="bg-danger p-2 form-field-error-box m-0 text-white">
                                                    <span className="me-2"><HiOutlineBellAlert className="alert-icon" /></span>
                                                    <span>{formValidationErrors["image"]}</span>
                                                </p>}
                                            </section>
                                            {(selectedBrandImageIndex !== projectIndex && selectedProjectIndex !== projectIndex) &&
                                                <button
                                                    className="btn btn-success d-block mb-3 w-50 mx-auto global-button"
                                                    onClick={() => changeProjectImage(projectIndex)}
                                                >Change</button>
                                            }
                                            {waitChangePreviousProjectsImageMsg && selectedBrandImageIndex === projectIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{waitChangePreviousProjectsImageMsg}</button>}
                                            {successChangePreviousProjectsImageMsg && selectedBrandImageIndex === projectIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{successChangePreviousProjectsImageMsg}</button>}
                                            {errorChangePreviousProjectsImageMsg && selectedBrandImageIndex === projectIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{errorChangePreviousProjectsImageMsg}</button>}
                                        </td>
                                        <td className="update-cell">
                                            {selectedProjectIndex !== projectIndex && <>
                                                <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => updateProjectInfo(projectIndex)}
                                                >Update</button>
                                                <hr />
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => deleteProject(projectIndex)}
                                                >Delete</button>
                                            </>}
                                            {waitMsg && selectedProjectIndex === projectIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{waitMsg}</button>}
                                            {successMsg && selectedProjectIndex === projectIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{successMsg}</button>}
                                            {errorMsg && selectedProjectIndex === projectIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{errorMsg}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allPreviousProjectsInsideThePage.length === 0 && !isGetPreviousProjects && <NotFoundError errorMsg="Sorry, Can't Find Any Previous Projects !!" />}
                    {isGetPreviousProjects && <TableLoader />}
                    {errorMsgOnGetProviousProjectsData && <NotFoundError errorMsg={errorMsgOnGetProviousProjectsData} />}
                    {totalPagesCount > 1 && !isGetPreviousProjects &&
                        <PaginationBar
                            totalPagesCount={totalPagesCount}
                            currentPage={currentPage}
                            getPreviousPage={getPreviousPage}
                            getNextPage={getNextPage}
                            getSpecificPage={getSpecificPage}
                        />
                    }
                </div>
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}