import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ubuybluesLogo from "../../../public/images/storeLogo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { FiLogIn } from "react-icons/fi";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { getAdminInfo } from "../../../public/global_functions/popular";

export default function AdminLogin() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.adminTokenNameInLocalStorage);
        if (adminToken) {
            getAdminInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        setIsLoadingPage(false);
                    } else await router.replace("/");
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
        } else setIsLoadingPage(false);
    }, []);

    const adminLogin = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "email",
                    value: email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        }
                    },
                },
                {
                    name: "password",
                    value: password,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait To Logining ...");
                const result = (await axios.get(`${process.env.BASE_API_URL}/admins/login?email=${email}&password=${password}&language=${process.env.defaultLanguage}`)).data;
                console.log(result)
                if (result.error) {
                    setWaitMsg("");
                    setErrorMsg(result.msg);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 4000);
                } else {
                    localStorage.setItem(process.env.adminTokenNameInLocalStorage, result.data.token);
                    await router.replace("/");
                }
            }
        } catch (err) {
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    return (
        <div className="admin-login d-flex flex-column justify-content-center">
            <Head>
                <title>{process.env.storeName} Admin Dashboard - Login</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <div className="page-content text-center p-4">
                <div className="container p-4">
                    <img src={ubuybluesLogo.src} alt="logo" width="150" height="150" className="mb-5" />
                    <form className="admin-login-form mb-3" onSubmit={adminLogin}>
                        <div className="email-field-box">
                            <input
                                type="text"
                                placeholder="Please Enter Your Email"
                                className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                            <div className='icon-box other-languages-mode'>
                                <BiSolidUser className="icon" />
                            </div>
                        </div>
                        {formValidationErrors["email"] && <p className="error-msg text-danger">{formValidationErrors["email"]}</p>}
                        <div className="password-field-box">
                            <input
                                type={isVisiblePassword ? "text" : "password"}
                                placeholder="Please Enter Your Password"
                                className={`form-control p-3 border-2 ${formValidationErrors["password"] ? "border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setPassword(e.target.value.trim())}
                            />
                            <div className='icon-box other-languages-mode'>
                                {!isVisiblePassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                {isVisiblePassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                            </div>
                        </div>
                        {formValidationErrors["password"] && <p className='error-msg text-danger'>{formValidationErrors["password"]}</p>}
                        {!waitMsg && !errorMsg && <button type="submit" className="btn btn-success mx-auto d-block mb-4 p-3 button">
                            <span className="me-2">Login</span>
                            <FiLogIn />
                        </button>}
                        {waitMsg && <button disabled className="btn btn-primary mx-auto d-block mb-4">
                            <span className="me-2">{waitMsg}</span>
                        </button>}
                        {errorMsg && <button disabled className="btn btn-danger mx-auto d-block mb-4">
                            <span className="me-2">{errorMsg}</span>
                            <FiLogIn />
                        </button>}
                        <a href={`${process.env.WEBSITE_URL}/forget-password?userType=admin`} className="btn btn-danger mx-auto mb-4 button">
                            <span className="me-2">Forget Password</span>
                        </a>
                    </form>
                </div>
            </div>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}