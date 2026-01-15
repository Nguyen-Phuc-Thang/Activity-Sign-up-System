import React, { useState } from 'react';
import { Colors } from '../global/styles';
import '../styles/pages/Login.css';
import { supabase } from '../database/supabase';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Login error: ' + error.message);

        } else {
            navigate('/admin/activity');
        }
    }

    return (
        <div className="login-page" style={{ backgroundColor: Colors.BACKGROUND }}>
            <h1 className="login-title" style={{ color: Colors.TEXT }}>Login</h1>
            <div className="login-card" style={{ backgroundColor: Colors.PRIMARY }}>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(email, password); }} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" style={{ color: Colors.TEXT }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" style={{ color: Colors.TEXT }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" style={{ backgroundColor: Colors.SECONDARY, color: '#ffffff' }}>Login</button>

                </form>
            </div>
        </div>
    );
}