import Image from "next/image";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { headers } from "next/headers"
import toast, { Toaster } from 'react-hot-toast';
import pool from "@/lib/db";
import { notFound } from "next/navigation";
import toRupiah from '@develoka/angka-rupiah-js';

const Navbar = dynamic(() => import('@/components/navBar'), { ssr: false });

interface PostPageProps {
    params: {
        obat: string;
    };
}

const fetchObat = async (query = '') => {
    try {
        const res = await fetch(`/api/medications?page=1&limit=1&search=${query}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching photos:", error);
        toast.error("Gagal memuat data");
        return { data: [], total: 0 };
    }
};

export default async function ObatDetailPage({ params }: PostPageProps) {
    const { obat } = params;
    var titleExt = obat?.split("-")
    var titleExt2 = titleExt.join(" ")
    var results = await fetchObat(titleExt2)
    if (results.total < 1) return notFound();
    return (<div>
        <Toaster />
        <header>
            <Navbar />
        </header>
        <main className="detail-obat-page">

            <div className="detail-produk-container">
                <div className="foto-produk">
                    <img src={results?.data[0].image} alt=""/>
                </div>
                <div className="keterangan-produk">
                    <h2 className="nama-produk">{results?.data[0].name}</h2>
                    <h3 className="harga-produk">{toRupiah(results?.data[0].price)}</h3>
                    <p className="per">Per <span>{}</span></p>

                    <div className="keterangan">
                        <h3>Keterangan: </h3>
                        <ul>
                            <li><span>
                                <b>Fungsi:</b> Becom-Zet Kaplet bermanfaat untuk memenuhi kebutuhan multivitamin untuk memelihara daya tahan tubuh dan mempercepat pemulihan setelah sakit.
                            </span> </li>
                            <li><span>
                                <b>Komposisi:</b> Vitamin E 30 IU, vitamin C 750 mg, vitamin B1 15 mg, vitamin B2 15 mg, vitamin B6 20 mg, vitamin B12 12 mcg, asam folat 400 mcg, asam pantotenat 20 mg, zinc 22,5 mg, niacin 100 mg.
                            </span></li>
                            <li><span>
                                <b>Golongan:</b> Obat bebas
                            </span></li>
                            <li><span><b>Kategori:</b> Suplemen</span></li>
                            <li><span><b>Bentuk Obat:</b> Kaplet</span></li>
                            <li><span><b>Kemasan:</b> Strip @ 10 Kaplet</span></li>
                            <li><span><b>Farmasi:</b> PT Sanbe Farma</span></li>
                            <li><span><b>No BPOM:</b> SD191555181</span></li>
                        </ul>
                    </div>

                    <div className="button-produk">
                        <a href="login.html" className="beli-btn">Beli Sekarang</a>
                        <a href="apotek-terdekat.html" className="beli-btn">Cek di Apotek Terdekat</a>
                    </div>
                </div>
            </div>

        </main>
        <footer>
            <p>Copyright 2024&copy;Unix Team</p>
        </footer>
    </div>);
}
