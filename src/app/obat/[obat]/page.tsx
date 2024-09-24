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

function hapusKataBerulang(teks) {
    const kataArray = teks?.split(' ');
    const kataSet = new Set();

    const hasil = kataArray?.filter(kata => {
        const kataBersih = kata.trim();
        if (!kataSet.has(kataBersih)) {
            kataSet.add(kataBersih);
            return true; // Ambil kata jika belum ada di Set
        }
        return false; // Lewatkan jika sudah ada
    });

    return hasil?.join(' ');
}

const fetchObat = async (query = '') => {
    try {
        var result = await pool.query(`SELECT * FROM medications WHERE LOWER(name) LIKE '${query}' LIMIT 1`)
        return { total: 1, data: result.rows };
    } catch (error) {
        console.error("Error fetching photos:", error);
        return { data: [], total: 0 };
    }
};

export default async function ObatDetailPage({ params }: PostPageProps) {
    const { obat } = params;
    var titleExt = obat?.split("-")
    var titleExt2 = titleExt.join(" ")
    var results = await fetchObat(titleExt2)
    console.log(results.data[0])
    if (results.total < 1 || !results.data[0]) return notFound();
    return (<div>
        <header>
            <Navbar />
        </header>
        <main className="detail-obat-page">
            <div className="detail-produk-container">
                <div className="foto-produk">
                    <img src={results?.data[0]?.image || "/image/not-found.png"} alt="" />
                </div>
                <div className="keterangan-produk">
                    <h2 className="nama-produk">{results?.data[0]?.name}</h2>
                    <h3 className="harga-produk">{toRupiah(parseInt(results?.data[0]?.harga))}</h3>
                    <p className="per">Per <span>{results?.data[0]?.tiap}</span></p>

                    <div className="keterangan">
                        <h2>Keterangan </h2>
                        <hr/>
                        <ul>
                            {!!results?.data[0]?.deskripsi ? (<li><span><b>Deskripsi : </b> {results?.data[0].deskripsi}</span> </li>) : ''}   
                            {!!results?.data[0]?.indikasi ? (<li><span><b>Indikasi : </b> {results?.data[0].indikasi}</span> </li>) : ''}                            
                            {!!results?.data[0]?.kategori ? (<li><span><b>Kategori : </b> {results?.data[0].kategori}</span> </li>) : ''}                            
                            {!!results?.data[0]?.komposisi ? (<li><span><b>Komposisi : </b> {results?.data[0].komposisi}</span> </li>) : ''}                            
                            {!!results?.data[0]?.dosis ? (<li><span><b>Dosis : </b> {results?.data[0].dosis}</span> </li>) : ''}                            
                            {!!results?.data[0]?.aturan ? (<li><span><b>Aturan Pakai : </b> {results?.data[0].aturan}</span> </li>) : ''}                            
                            {!!results?.data[0]?.kontra ? (<li><span><b>Kontra Indikasi : </b> {results?.data[0].kontra}</span> </li>) : ''}                            
                            {!!results?.data[0]?.efek_samping ? (<li><span><b>Efek Samping : </b> {results?.data[0].efek_samping}</span> </li>) : ''}                            
                            {!!results?.data[0]?.golongan ? (<li><span><b>Golongan Produk : </b> {results?.data[0].golongan}</span> </li>) : ''}                            
                            {!!results?.data[0]?.kemasan ? (<li><span><b>Kemasan : </b> {results?.data[0].kemasan}</span> </li>) : ''}                            
                            {!!results?.data[0]?.manufaktur ? (<li><span><b>Pabrik/Manufaktur : </b> {results?.data[0].manufaktur}</span> </li>) : ''}                            
                            {!!results?.data[0]?.no_reg ? (<li><span><b>No. BPOM : </b> {results?.data[0].no_reg}</span> </li>) : ''}                            
                        </ul>
                    </div>

                    <div className="button-produk">
                        <Link href={"/checkout/"+results.data[0].id} className="beli-btn" prefetch={true}>Beli Sekarang</Link>
                        <Link href="/apotek-terdekat" className="beli-btn" prefetch={true}>Cek di Apotek Terdekat</Link>
                    </div>
                </div>
            </div>

        </main>
        <footer>
            <p>Copyright 2024&copy;Unix Team</p>
        </footer>
    </div>);
}
