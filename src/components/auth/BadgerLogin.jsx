import React, { useContext, useRef } from 'react'
import { Container, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import BadgerLoginStatusContext  from "../contexts/BadgerLoginStatusContext";


export default function BadgerLogin() {
    const userNameRef = useRef()
    const pinRef = useRef()
    const navigate = useNavigate()
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext)

    const handleLogin = (e) => {
        e.preventDefault()

        const username = userNameRef.current.value;
        const pin = pinRef.current.value;

        if (!username || !pin) {
            alert("You must provide both a username and pin!")
            return;
        }
        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin is a 7-digit number!")
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_fe644695e8fbd9ec9d7c0dfa830d466ac60cf83462fbf26e7e2f957a633f3623"
            },
            credentials: "include",
            body: JSON.stringify({ username, pin })
        })
        .then(response => ({ status: response.status }))
        .then(({ status }) => {
            if (status === 200) {
                alert("Login successful!")
                setLoginStatus({ loggedIn: true, username })
                sessionStorage.setItem("loginStatus", JSON.stringify({ loggedIn: true, username }))
                navigate('/')
            } else if (status === 401) {
                alert("Incorrect username or pin!")
            } else {
                alert("An unknown error occurred.")
            }
        })
    };

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control id="username" type="text" ref={userNameRef} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control id='password' type="password" ref={pinRef} />
                </Form.Group>
                <Button variant="primary" type="submit">Login</Button>
            </Form>
        </Container>
    );
}
