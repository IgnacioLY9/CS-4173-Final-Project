import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import '../Styling/Login.css'
import logo from '../logo.png'
import CryptoJS from "crypto-js"

function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cipher, setCipher] = useState('DES')
    const navigate = useNavigate()

    function signin(e) {
        e.preventDefault()

        if (!username.trim() || !password.trim()) {
            alert("Both username and password are required.");
            return;
        }

        let hashedPassword;
        if (cipher === 'DES') {
            hashedPassword = CryptoJS.PBKDF2(password, "", {
                keySize: 64/32
            }).toString();
        }
        else {
            hashedPassword = CryptoJS.PBKDF2(password, "", {
                keySize: 128/32
            }).toString();
        }

        navigate("/Messaging", { state: { username, hashedPassword, cipher } })
    }

    function changeUser(e) {
        setUsername(e.target.value)
    }

    function changePassword(e) {
        setPassword(e.target.value)
    }

    function changeCipher(e) {
        setCipher(e.target.value)
    }


    return (
        <div className="Container">
            <div className = "SignInBlock">
                <img src={logo} className="Logo" alt="logo" />
                <h4 className="Title">Not Secure Secure Messaging</h4>
                <form onSubmit={signin} className="InputContainer">
                    <input id="Username" name="username" className="textbox" type="text" placeholder="Username" 
                    title="Name that will be displayed" required="" autoFocus="" onChange={changeUser}/>
                    <input id="Password" name="password" className="textbox" type="password" placeholder="Password" 
                    title="Password" required="" autoFocus="" onChange={changePassword}/>
                    <fieldset>
                        <legend>Select a Cipher:</legend>

                        <div>
                            <input type="radio" id="des" name="cipher" value="DES" checked={cipher === "DES"} onChange={() => setCipher("DES")} />
                            <label htmlFor="des">DES</label>
                        </div>

                        <div>
                            <input type="radio" id="aes" name="cipher" value="AES" checked={cipher === "AES"} onChange={() => setCipher("AES")}/>
                            <label htmlFor="aes">AES</label>
                        </div>
                    </fieldset>
                    <input className="enterButton" type="submit" value="Sign In" title="submit"></input>
                </form>
            </div>
        </div>
    )
}

export {Login}