// Navbar.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { AuthProvider, useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function NavbarComponent() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.reload();
    };
    return (
        <AuthProvider>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">MedAdvisor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                        {user ? (
                            <>
                                <Navbar.Text>
                                    Welcome, {user.username}!
                                </Navbar.Text>
                                <Button variant="outline-danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline-success" onClick={() => navigate('/register')} className="mx-2">
                                    Register
                                </Button>
                                <Button variant="outline-primary" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </AuthProvider>
    );
}

export default NavbarComponent;
