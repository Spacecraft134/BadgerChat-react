import React, { useContext, useEffect, useState } from "react";
import BadgerMessage from "./BadgerMessage";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap"; 
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(json => {
            setMessages(json.messages);
        });
    };

    useEffect(loadMessages, [props, page]);
    
    const handlePost = (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert('You must provide both a title and content!');
            return;
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include",
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(() => {
            alert("Successfully posted!");
            setTitle("");
            setContent("");
            loadMessages();
        })
        .catch(err => console.error("Error posting message:", err));
    };

    const deletePost = (id) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${id}`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include",
        })
        .then(res => res.json())
        .then(() => {
            alert('Successfully deleted the post!')
            loadMessages()
        })
    }

    return (
        <Container>
            <h1>{props.name} Chatroom</h1>
            
            <Row>
                <Col md={4}>
                    {loginStatus.loggedIn ? (
                        <Form onSubmit={handlePost} className="mb-4">
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor="postTitle">Post Title:</Form.Label>
                                <Form.Control 
                                    id="postTitle"
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor="postContent">Post Content:</Form.Label>
                                <Form.Control 
                                    id="postContent"
                                    type="text" 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Create Post</Button>
                        </Form>
                    ) : (
                        <p style={{ fontWeight: "bold" }}>You must be logged in to post!</p>
                    )}
                </Col>

                <Col md={8}>
                    <hr />
                    {messages.length > 0 ? (
                        <Row>
                            {messages.map(message => (
                                <Col key={message.id} xs={12} sm={6} xl={4}>
                                    <BadgerMessage
                                        title={message.title}
                                        poster={message.poster}
                                        content={message.content}
                                        created={message.created}
                                        id={message.id}
                                        user={loginStatus.username}
                                        deleted={deletePost}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p>There are no messages on this page yet!</p>
                    )}

                    <Pagination className="justify-content-center">
                        {[1, 2, 3, 4].map(num => (
                            <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
                                {num}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
}
