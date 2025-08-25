import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext  from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleRegister = (e) => {
        e.preventDefault();

        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }
        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }
        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_fe644695e8fbd9ec9d7c0dfa830d466ac60cf83462fbf26e7e2f957a633f3623"
            },
            credentials: "include",
            body: JSON.stringify({ username, pin })
        })
        .then(response => {
            if (response.status === 200) {
                alert("Registration successful!");
                setLoginStatus({ loggedIn: true, username })
                sessionStorage.setItem("loginStatus", JSON.stringify({ loggedIn: true, username }))
                navigate('/')
            } else if (response.status === 409) {
                alert("That username has already been taken!");
            } else {
                alert("An unknown error occurred.");
            }
        })
    };

    return (
        <Container>
            <h1>Register</h1>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control 
                        id="username"
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control 
                        id="password"
                        type="password" 
                        value={pin} 
                        onChange={(e) => setPin(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="repeatPassword">Repeat Password</Form.Label>
                    <Form.Control 
                        id="repeatPassword"
                        type="password" 
                        value={confirmPin} 
                        onChange={(e) => setConfirmPin(e.target.value)} 
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </Container>
    );
}
