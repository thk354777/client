import React, { useState } from 'react';
import { auth, provider } from '../firebase-config';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login and Signup
  let navigate = useNavigate();

  // Google Sign-In
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      navigate('/');
    });
  };

  // Email/Password Login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error.message);
      alert('Login failed. Check your credentials.');
    }
  };

  // Email/Password Signup
  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      navigate('/');
    } catch (error) {
      console.error('Signup Error:', error.message);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="loginPage">
      <h2>{isRegister ? 'Sign Up' : 'Log In'}</h2>

      <div className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={isRegister ? handleSignup : handleLogin}>
          {isRegister ? 'Sign Up' : 'Log In'}
        </button>
      </div>

      <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: 'pointer' }}>
        {isRegister
          ? 'Already have an account? Log in'
          : "Don't have an account? Sign up"}
      </p>

      <p>Or sign in with Google</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
