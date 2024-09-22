"use client"
import Image from "next/image";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { headers } from "next/headers"
import { useEffect, useState} from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Loader from "@/components/Loader";
import axios from "axios";

export default function LoginForm() {
    const router = useRouter()
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const searchParams = useSearchParams();
    useEffect(() => {
        const isLogin = searchParams.get('isRegister');
        if (isLogin && !show) {
            setShow(true);
            toast.success('login successfully!');
            router.replace(`/`);
        }
    }, [searchParams, router]);
    const validate = (formData) => {
        const newErrors: { email?: string, password?: string } = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.values(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        var formData = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        setLoading(true);
        if (validate(formData)) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, formData);
                if (response.status === 200) {
                    router.push("/?isLogin=true", { scroll: true })
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error("Login failed:", error);

            }
        } else {
            setLoading(false);
            console.log('Form validation failed:', errors);
        }
    };

    const dangerStyle = {
        color: "red",
        fontSize: "14px",
    };

    return (<div>
        <Toaster/>
        <main>
            <section>
                <div className="form-container">
                    <form onSubmit={handleSubmit} method="POST">
                        <div className="input-group input-name">
                            <label htmlFor="usernameOrEmail">Username atau Email</label>
                            <input
                                type="text"
                                id="usernameOrEmail"
                                placeholder="Masukkan Username atau Email"
                                name="email"
                                required
                            />
                            {errors?.email && <span style={dangerStyle}>{errors?.email}</span>}
                        </div>

                        <div className="input-group password-container">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Masukkan Password"
                                name="password"
                                required
                            />
                            {errors?.password && <span style={dangerStyle}>{errors?.password}</span>}
                            <div className="toggle-password-container">
                                <span className="toggle-password" id="togglePassword">👁️</span>
                                <br />
                                <span className="toggle-text" id="toggleText">Sembunyikan</span>
                            </div>
                        </div>

                        <div className="actions">
                            <label className="remember-me">
                                <input type="checkbox" id="remember" /> Ingat Saya
                            </label>
                            <Link href="#" className="forgot-password">Lupa Password?</Link>
                        </div>
                        <button className="submit-btn" disabled={loading}>
                            {loading ? (
                                <Loader/>
                            ) : (
                                'LOGIN'
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    </div>
    );
}
