import React, { useState } from 'react'
import "./Login.css"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthState';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5098/api/User/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName:username, password })
            });
            // const userData = await response.json();

            if (response.ok) {
                login(username);
                navigate(`/`)
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='login-container'>
            <h1 className='login-title'>Login</h1>
            <form className='login-content' onSubmit={handleSubmit}>
                <div className='login-info'>
                    <input type='text' placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <input type='text' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button type='submit' className='btn'>Login</button>
                </div>
            </form>
            <div className='register-here'>
                <h3>Register <Link to="/register" className='button'>here</Link></h3>
            </div>
        </div>
    )
}
