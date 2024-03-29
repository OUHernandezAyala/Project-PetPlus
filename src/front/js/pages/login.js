import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/logopetplus.png";

const BACKEND_URL = process.env.BACKEND_URL;

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    //Fucniones onChange de los input del formulario

    function setEmailValue(event) {
        const value = event.target.value;
        setEmail(value);
    }

    function setPasswordValue(event) {
        const value = event.target.value;
        setPassword(value);
    }

    //Funciones para verificaciones de inputs

    //Email

    function verifyEmailParameters() {
        if (email.includes(".com") &&
            email.includes("@") &&
            email.length !== "") {
            return true
        }
        return false
    }

    function verifyEmail() {
        if (verifyEmailParameters()) {
            return true
        }
        setErrorMessage("El correo electrónico que proporcionaste no es válido")
        return false
    }

    //Password

    function verifyPassowordParameters() {
        if (password.length >= 1) {
            return true
        }
        return false
    }

    function verifyPassword() {
        if (!verifyPassowordParameters()) {
            setErrorMessage("Contraseña es un campo obligatorio");
            return false
        }
        return true
    }

    //Funcion para realizar el envio de datos a la API

    async function enviarData() {
        try {
            const response = await fetch(BACKEND_URL + "api/token",
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            "email": email,
                            "password": password
                        }
                    ),
                    headers: {
                        'Content-Type': "application/json"
                    }
                })

            if (response.status !== 201) {
                setErrorMessage("Correo electrónico o contraseña incorrecta, vuelve a intentarlo");
                return false
            }

            const data = await response.json();

            return data;

        } catch (error) {
            setErrorMessage("Ocurrió un error, vuelve a intentarlo más tarde")
            console.log(error)
            return false
        }

    }

    //Funcion para manejar el onClick de enviar formulario (login)

    async function submitHandler(event) {
        event.preventDefault();
        if (verifyEmail() &&
            verifyPassword()) {

            const responseData = await enviarData();

            if (responseData === false) {
                window.scrollTo(0, 0);
                return
            }

            const token = responseData.token;
            const expirationDate = new Date();
            const name = responseData.name;
            expirationDate.setDate(expirationDate.getDate() + 1);
            localStorage.setItem("token", token);
            localStorage.setItem("name", name);
            localStorage.setItem("expiration", expirationDate.getTime());

            if (responseData.type === "user") {
                navigate("/dashboard");
                return
            }
            navigate("/veterinary");


        }
        window.scrollTo(0, 0);
    }

    return (
        <div className="container-fluid div-signup d-flex align-items-center flex-column background-container-forms h-100">

            {errorMessage && (
                <div className="alert alert-danger error-message" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className="signup-header mb-3">
                <img src={logo} />
                <h2 className="mt-3">Iniciar Sesión</h2>
            </div>

            <form className="contenedor-form mb-5 h-100">
                <div className="mb-3 d-flex justify-content-center flex-column align-items-center">
                    <div className="div-input-interno">
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" autoComplete="off" value={email} onChange={setEmailValue} placeholder="email@email.com" />
                    </div>
                </div>
                <div className="mb-4 d-flex justify-content-center flex-column align-items-center">
                    <div className="div-input-interno">
                        <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" autoComplete="off" value={password} onChange={setPasswordValue} placeholder="*******" />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary boton-signup" onClick={submitHandler}>Iniciar Sesión</button>
            </form>

            <div className="question-mark">
                <div>
                    ¿Aún no tienes cuenta? <Link to={"/signup"}>¡Regístrate!</Link>
                </div>
            </div>

        </div>
    )
}

export default Login;