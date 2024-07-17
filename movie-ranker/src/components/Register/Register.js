import React from 'react'
import "./Register.css"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const response = await fetch(`http://localhost:5098/api/User`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: username, password, email, rankedMovies: []
            })
        });

        if (response.ok){
            navigate(`/login`)
        } else{
            console.error("failed to register")
        }
    }

  return (
    <div className='register-container'>
        <h1 className='register-title'>Register</h1>
        <div className='register-content' onSubmit={handleSubmit}>
            <form className='register-info'>
                <input type='text' placeholder='Username' autocomplete="off" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type='text' placeholder='Password' autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type='email' placeholder='Email' autocomplete="off" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button type='submit' className='btn'>Register</button>
            </form>
        </div>
        <div className='login-here'>
            <h3>Login <Link to="/login" className='button'>here</Link></h3>
        </div>
    </div>
  )
}
