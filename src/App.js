import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import { UserProvider } from './UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';






function App() {
  const [user, setUser] = useState({ id: null });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    fetch(`https://fitnessapp-api-ln8u.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data !== "undefined") {
          setUser({ id: data._id });
        } else {
          setUser({ id: null });
        }
      });
  }, []);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  // **Missing return statement added here**
  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workouts" element={<Workouts />} />


          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
