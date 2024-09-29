"use client";
import Image from "next/image";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const Navbar = dynamic(() => import('@/components/navBar'), { ssr: false });

const fetchArtikel = async () => {
  try {
    const res = await fetch(`/api/artikel?page=1&limit=4`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching:", error);
    toast.error("Gagal memuat data");
    return { data: [], total: 0 };
  }
};

const fetchObat = async () => {
  try {
    const res = await fetch(`/api/medications?page=1&limit=12`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching:", error);
    toast.error("Gagal memuat data");
    return { data: [], total: 0 };
  }
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [artikel, setArtikel] = useState([]);
  const [obat, setObat] = useState([]);

  useEffect(() => {
    const isLogin = searchParams.get('isLogin');
    if (isLogin && !show) {
      setShow(true);
      toast.success('Login successfully!');
      router.replace(`/`);
    }
  }, [searchParams, router, show]);

  useEffect(() => {
    const loadArtikel = async () => {
      const { data } = await fetchArtikel();
      setArtikel(data);
    };
    loadArtikel();
  }, []);

  useEffect(() => {
    const loadObat = async () => {
      const { data } = await fetchObat();
      setObat(data);
    };
    loadObat();
  }, []);

  return (
    <div>
      <Toaster />
      <header>
        <Navbar />
      </header>
      <main>
        <div className="intro">
          <div className="content">
            <div className="text">
              <h1>
                Kesehatan Anda, <br /> Prioritas Kami
              </h1>
              <p>Temukan solusi untuk kesehatanmu</p>
              <div className="button-intro">
                <Link href="/obat" prefetch={true}>
                  <button className="CTA-button">Cari Obat</button>
                </Link>
                <Link href="/artikel" prefetch={true}>
                  <button className="CTA-button">Info Kesehatan</button>
                </Link>
              </div>
            </div>
            <div className="hero">
              <img src="/image/undraw_doctor_kw-5-l.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="artikel-homepage">
          <div className="judul">
            <h2>Baca Artikel Terbaru</h2>
            <Link href="/artikel" prefetch={true}>Lihat Semua</Link>
          </div>

          <div className="isi-artikel-card">
            {artikel.map((art: any) => (
              <Link key={art.id} href={`/artikel/${art.title.replace(/\s+/g, "-").toLowerCase()}/${art.article_id}`}>
                <div className="artikel-card">
                  <img src={art.image} alt={art.title} />
                  <h3>{art.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="artikel-homepage">
          <div className="judul">
            <h2>Obat dan Vitamin</h2>
            <Link href="/obat" prefetch={true}>Lihat Semua</Link>
          </div>

          <div className="kategori-item-section">
            {obat.map((art: any) => (
              <Link href={"/obat/" + art.name.replace(/\s+/g, "-").toLowerCase()} className="kategori-item" prefetch={true}>
                <img src={art.image} alt="" className="kategori-img" />
                <h4 className="kategori-value">{art.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <p>Copyright 2024&copy; Unix Team</p>
      </footer>
    </div>
  );
}
