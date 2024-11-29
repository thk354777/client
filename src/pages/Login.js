import React, { useState } from 'react';
import { auth, provider } from '../firebase-config';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register modes
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate('/');
    }).catch((error) => {
      console.error("Google sign-in error", error.message);
    });
  };

  const handleEmailPasswordSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Sign up logic
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          localStorage.setItem("isAuth", true);
          setIsAuth(true);
          navigate('/');
        })
        .catch((error) => {
          console.error("Sign-up error:", error.message);
        });
    } else {
      // Login logic
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          localStorage.setItem("isAuth", true);
          setIsAuth(true);
          navigate('/');
        })
        .catch((error) => {
          console.error("Login error:", error.message);
        });
    }
  };

  return (
    <div className="loginPage">
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {/* Google Sign-In Button */}
      <button className='login-with-google-btn' onClick={signInWithGoogle}>
        Sign In with Google
      </button>

      {/* Email and Password Form */}
      <form onSubmit={handleEmailPasswordSubmit}>
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
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>

      {/* Toggle between Login and Register */}
      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;