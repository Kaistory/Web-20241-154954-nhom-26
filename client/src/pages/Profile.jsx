import { Navigate} from "react-router-dom"
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button, Form, Alert } from 'react-bootstrap';
import { postRequest, baseUrl } from '../utils/services';

const Profile = () => {
    const { user, updateError, updateSuccess } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '' 
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '' 
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        console.log(user)
        
        const response = await postRequest(`${baseUrl}/users/update/${user._id}`, JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
        })); 
        
    };

    return (
        <div className="profile-container">
            <h2>Edit Profile</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="username"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Profile
                </Button>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>} {/* Hiển thị thông báo lỗi nếu có */}
            {updateError && <Alert variant="danger">{updateError}</Alert>}
            {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
        </div>
    );
};

export default Profile;