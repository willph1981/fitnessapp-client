import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import UserContext from '../UserContext';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                
            } else {
                notyf.error(data.message || 'User Not Found. Try Again.');
            }
        });
    }

    function retrieveUserDetails(token) {
    console.log("Token being sent:", token);

    fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        console.log("User data received:", data);
        if (data && data.user) {  // Checking for the correct object
            setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        } else {
            notyf.error('Failed to fetch user details');
        }
    })
    .catch(err => notyf.error('Error fetching user details'));
}



    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    if (user.id) {
        return <Navigate to="/workouts" />;
    }

    return (
        <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant={isActive ? "primary" : "danger"} type="submit" disabled={!isActive}>
                Login
            </Button>
        </Form>
    );
}
