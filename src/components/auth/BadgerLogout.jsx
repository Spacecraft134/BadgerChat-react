import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogout() {
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            setLoginStatus({ loggedIn: false, username: null });
            sessionStorage.removeItem("loginStatus")
            alert("You have been logged out.")
            navigate('/')
        })
    }, [navigate,setLoginStatus]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
