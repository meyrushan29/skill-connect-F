import React, { useState } from "react";
import { auth, provider } from "./auth/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import google from "./assets/images/google.png";

function GoogleAuth({ handleAuth }) {
    const handleClick = () => {
        signInWithPopup(auth, provider).then((data) => {
            console.log(data, "Data");
            if (data) {
                handleAuth(data)
            }
        })
    }

    return (
        <div>
            <div onClick={handleClick} className="loginButton google" >
                <img src={google} alt="" className="icon"  />
                Continue with Google
            </div>

            {/* <button onClick={handleClick}>Signin With Google</button> */}
        </div>
    );
}
export default GoogleAuth;