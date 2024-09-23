import React, { useState } from 'react';

const PasswordInput = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="password-input-container">
      <input
        type={passwordVisible ? "text" : "password"}
        id="password"
        placeholder="Enter password"
      />
      <button 
        id="togglePassword" 
        onClick={togglePasswordVisibility}
        aria-label={passwordVisible ? "Hide password" : "Show password"}
      >
        {passwordVisible ? "👁️‍🗨️" : "👁️"}
      </button>
      <span id="toggleText" onClick={togglePasswordVisibility}>
        {passwordVisible ? "Sembunyikan" : "Tampilkan"}
      </span>
    </div>
  );
};

export default PasswordInput;