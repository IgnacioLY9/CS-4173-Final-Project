import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import './Login.css'
import logo from '../logo.png'

function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function signin(e) {
        e.preventDefault()

        if (!username.trim() || !password.trim()) {
            alert("Both username and password are required.");
            return;
        }
        console.log(username)
        console.log(password)

        navigate("/Messaging", { state: { username, password } })
    }

    function changeUser(e) {
        setUsername(e.target.value)
    }

    function changePassword(e) {
        setPassword(e.target.value)
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
                    <input className="enterButton" type="submit" value="Sign In" title="submit"></input>
                </form>
            </div>
        </div>
    )
}

export {Login}