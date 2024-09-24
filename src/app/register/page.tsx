"use client"
import axios from "axios";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Loader from "@/components/Loader";
import PasswordInput from "@/components/inputPassword";
import Link from "next/link";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors: { name?: string, email?: string, password?: string } = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (/[^a-zA-Z0-9\s]/.test(formData.name)) {
      newErrors.name = 'Username must contain only letters and number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if (validate()) {
      if (typeof document !== 'undefined') {
        axios.post("http://localhost:3000/auth/register", formData).then((data) => {
          if (data.status == 200) {
            router.push("/login?isRegister=true")
            setLoading(false)
          }
        }).catch(e => {
          if (e.response.status == 409) {
            setErrors({ email: "Email already used" })
            setLoading(false)
          } else if (e.response.status == 400) {
            if (e.response?.data?.includes("password")) {
              setErrors({ password: e.response?.data })
              setLoading(false)
            } else if (e.response?.data?.includes("email")) {
              setErrors({ email: e.response?.data })
              setLoading(false)
            }
          }
        })
      }
    } else {
      console.log('Form validation failed:', errors);
    }
  };

  var dangerStyle = {
    color: "red",
    font_size: "14px",
  };

  return (
    <div>
      <Toaster />
      <main>
        <section>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="input-group input-name">
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Masukkan Username"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required />
                {errors?.name && <span style={dangerStyle}>{errors?.name}</span>}
              </div>

              <div className="input-group input-email">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Masukkan Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required />
                {errors?.email && <span style={dangerStyle}>{errors?.email}</span>}
              </div>

              <div className="input-group password-container">
                <label htmlFor="password">Password</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Masukkan Password"
                  className="input-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required />
                {errors?.password && <span style={dangerStyle}>{errors?.password}</span>}
                <div className="toggle-password-container">
                  <span
                    id="togglePassword"
                    onClick={togglePasswordVisibility}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? "👁️‍🗨️" : "👁️"}
                  </span>
                  <span id="toggleText" onClick={togglePasswordVisibility}>
                    {passwordVisible ? "Sembunyikan" : "Tampilkan"}
                  </span>
                </div>

              </div>

              <div className="profile-buttons">
                <button className="button" disabled={loading}>
                  {loading ? (
                    <Loader />
                  ) : (
                    'Sign Up'
                  )}
                </button>
                <div className="go-to-signup">
                  <p style={{ margin: 0, padding: 0, paddingRight: '4px' }}>Sudah punya akun?</p><Link href="/login" className="forgot-password2" prefetch={true}>Login</Link>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}