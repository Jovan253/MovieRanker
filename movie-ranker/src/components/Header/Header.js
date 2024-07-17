import React from 'react'
import { Link } from 'react-router-dom'
import "./Header.css"
import { useAuth } from '../../context/AuthState'

export const Header = () => {
    const {user, logout} = useAuth();

    const handleLogout = () => {
        logout(user);
    }

  return (
    <header>
        <div className='container'>
            <div className='inner-content'>
                <div className='brand'>
                    <Link to="/">MovieRanker</Link>
                </div>
                <ul className='nav-links'>                    
                    {/* <li>
                        <Link to="/friends" className='button'>Friends</Link>
                    </li> */}
                    {user ? (
                        <li>
                            <button className='btn' onClick={handleLogout}>Logout</button>
                        </li>
                    ) : (
                        <>
                        <li>
                            <Link to="/login" className='button'>Login</Link>
                        </li>
                        <li>
                            <Link to="/register" className='button'>Register</Link>
                        </li>
                        </>
                    )}                                        
                    <li>
                        <Link to="/add" className='button'>Add</Link>
                    </li>
                </ul>
            </div>
        </div>
    </header>
  )
}
