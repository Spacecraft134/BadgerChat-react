import React, { useEffect, useState} from "react";
import {Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useNavigate} from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {
    const [loginStatus, setLoginStatus] = useState(() => {
        return JSON.parse(sessionStorage.getItem("loginStatus")) || { loggedIn: false, username: null }
    });
    const navigate = useNavigate()

    useEffect(() => {
        sessionStorage.setItem("loginStatus", JSON.stringify(loginStatus))
    }, [loginStatus])

    const handleLogout = () => {
        navigate('/logout')
    }
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus.loggedIn ? (
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        )}
                        <NavDropdown title="Chatrooms">
                            {props.chatrooms.map(chatroom => (
                                <NavDropdown.Item key={chatroom} as={Link} to={`/chatrooms/${chatroom}`}>
                                    {chatroom}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}


export default BadgerLayout;