import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";

function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="login-box">
        <p>Welcome to CashMtaani</p>
        <button onClick={signIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="login-box">
      <img src={user.photoURL} alt="Profile" width="40" height="40" style={{ borderRadius: "50%" }} />
      <p>Hello, {user.displayName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Login;
