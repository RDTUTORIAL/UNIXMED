"use client";
import Image from "next/image";
import Link from 'next/link';
import Navbar from "@/components/navBar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

export default function Profile() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        gender: '',
        birthday: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        password: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data }: any = await axios.get("/api/users");
                setFormData({
                    username: data.data.username || '',
                    gender: data.data.gender || '',
                    birthday: data.data.date_birthday ? data.data.date_birthday : '',
                    city: data.data.city || '',
                    address: data.data.address || '',
                    phone: data.data.phone_number || '',
                    email: data.data.email || '',
                    password: ''
                });
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/editProfile`, formData);
            if (response.status === 200) {
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error('Bad request 500');
            console.error("Login failed:", error);
        }
    };

    return (<div>
        <Toaster />
        <header>
            <Navbar />
        </header>
        <main>
            <section>
                <div className="container">
                    <div className="image-setting-container">
                        <img src="/image/Myu.webp" className="image-setting" alt="Foto Profil" title="Foto Profil" />
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Ubah Foto Profil
                        </label>
                        <input id="file-upload" type="file" className="input-edit-foto-profile" />
                    </div>
                    <form id="editProfileForm" onSubmit={handleSubmit}>
                        <div className="profile-section basic-info-form">
                            <h2>Informasi Dasar</h2>
                            <div className="basic-info-form">
                                <label htmlFor="nama">Nama</label>
                                <input type="text" id="nama" name="name" required value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="basic-info-form">
                                <label htmlFor="alamat">Alamat</label>
                                <input type="text" id="alamat" name="address" value={formData.address} onChange={handleChange} />
                            </div>
                            <div className="basic-info-form">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="basic-info-form">
                                <label htmlFor="telepon">Nomor Telepon</label>
                                <input type="tel" id="telepon" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="profile-section">
                            <div className="profile-section basic-info-form">
                                <h2>Informasi Biodata</h2>
                                <label htmlFor="tanggalLahir">Tanggal Lahir</label>
                                <input type="date" id="tanggalLahir" name="birthday" value={formData.birthday} onChange={handleChange} />
                            </div>

                            <div className="profile-section basic-info-form">
                                <label>Jenis Kelamin</label>
                                <br />
                                <input type="radio" id="laki" name="gender" value="M" checked={formData.gender === 'Male' || formData.gender === 'M'} onChange={handleChange} />
                                <label htmlFor="laki">Laki-laki</label>
                                <br />
                                <input type="radio" id="perempuan" name="gender" value="F" checked={formData.gender === 'Female' || formData.gender === 'F'} onChange={handleChange} />
                                <label htmlFor="perempuan">Perempuan</label>
                                <br />
                                <input type="radio" id="lainnya" name="gender" value="DLL" checked={formData.gender === 'Other' || formData.gender === 'DLL'} onChange={handleChange} />
                                <label htmlFor="lainnya">Lainnya</label>
                            </div>

                            <div className="profile-section basic-info-form">
                                <label htmlFor="password">Konfirmasi Password</label>
                                <input type="password" id="password" name="password" value={formData.password} required onChange={handleChange} />
                            </div>

                            <div className="profile-section basic-info-form">
                                <label htmlFor="kota">Kota/Kabupaten</label>
                                <input type="text" id="kota" name="city" value={formData.city} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="profile-buttons-edit">
                            <button type="submit" className="button-edit">Simpan</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    </div>);
}
