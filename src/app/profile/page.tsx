import Link from 'next/link';
import Navbar from "@/components/navBar";
import pool from "@/lib/db";
import { getUser } from "@/lib/DBFunction";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { jwtValid, jwtDecode } from "@/lib/func";
import moment from "moment"
import toast, { Toaster } from "react-hot-toast";
import jwt from 'jsonwebtoken';
import toRupiah from '@develoka/angka-rupiah-js';


export default async function profile() {
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    var id: any = false;
    let user: any = {}
    try {
        if (isAuth) {
            id = jwtDecode(token);
            if (!id && id == false) return redirect("/login");
            user = await getUser(id?.id.toString())
        }
    } catch (e) {
        console.log(e)
    }
    var orders = await pool.query(`select o.*, m.image, m.name  from orders o INNER JOIN medications m ON o.medication_id = m.id where user_id = '${id.id}'`);

    return (<div>
        <Toaster />
        <header>
            <Navbar />
        </header>
        <main>
            <section>
                <div className="container">
                    <div className="profile-header">
                        <img src={user?.pic || "/image/Myu.webp"} alt="Foto Profil" title="Foto Profil" />
                        <h1><span>{user?.username}</span></h1>
                        <p><span>{user?.address ? user.address : "-"}</span></p>
                        <p>Email: <span>{user?.email}</span></p>
                        <p>Nomor Telepon: <span>{user?.phone ? user.phone : "-"}</span></p>
                    </div>

                    <div className="profile-section">
                        <h2>Informasi Biodata</h2>
                        <p>Tanggal Lahir: <span>{user?.birthday ? moment(user.birthday).format("DD-MM-YYYY") : "-"}</span></p>
                        <p>Jenis Kelamin: <span>{user?.gender ? user.gender == "M" ? "Male" : user.gender == "F" ? "Female" : "Other" : "-"}</span></p>
                        <p>Kota/Kabupaten: <span>{user?.city ? user.city : "-"}</span></p>
                    </div>

                    <div className="profile-section">
                        <h2>Informasi Kontak</h2>
                        <p>Email:  <span>{user?.email}</span></p>
                        <p>Nomor Telepon: <span>{user?.phone ? user.phone : "-"}</span></p>
                    </div>

                    <div className="profile-section">
                        <h2>Riwayat Pemesanan</h2>
                        {orders.rows.length > 0 ? (
                            orders.rows.map((x: any) => (
                                <div className="history-card">
                                    <div className="gambar-produk-history">
                                        <img src={x.image} alt="gambar-produk" />
                                    </div>
                                    <div className="keterangan-history">
                                        <h3 className="nama-produk">{x.name}</h3>
                                        <p className="jumlah-beli"><span id="jumlah">{x.banyak_pembelian}</span> <span id="jenis-pack">{x.tiap}</span></p>
                                        <h4 className="total-harga-history">Total: Rp.<span>{toRupiah(parseInt(x.total_price)).replace("Rp", "")}</span></h4>

                                        <p className={`status-pembelian ${x.status == "cenceled" ? "cencel" : x.status == "success" ? "berhasil" : x.status == "pending" ? "pending" : "diproses"}`}>{x.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : "Tidak ada riwayat pesanan"}
                    </div>

                    <div className="profile-buttons">
                        <a href="/auth/logout" className="button">Keluar</a>
                        <Link href="/profile/edit" className="button" prefetch={true}>Pengaturan</Link>
                    </div>
                </div>

            </section>
        </main>
    </div>);
}
