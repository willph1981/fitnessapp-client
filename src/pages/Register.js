import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function registerUser(e) {
    e.preventDefault();
    fetch("https://fitnessapp-api-ln8u.onrender.com/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Registered Successfully") {
          alert("Registration successful!");  // Using alert for success
          console.log("Registration success triggered");
          console.log("Redirecting to login...");
          navigate("/login");
        } else {
          alert(data.message || "Registration failed.");  // Using alert for error
        }
      });
  }

  return (
    <Form onSubmit={registerUser}>
      <h1 className="my-5 text-center">Register</h1>
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

      <Button variant="primary" type="submit">Register</Button>
    </Form>
  );
}
