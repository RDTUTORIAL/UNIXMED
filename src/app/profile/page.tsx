import Image from "next/image";
import Link from 'next/link';
import Navbar from "@/components/navBar";
import { headers } from "next/headers"
import pool from "@/lib/db";
import { isAuthenticated } from "@/lib/func";
import { getUser } from "@/lib/UserFunction";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { jwtValid, jwtDecode } from "@/lib/func";
import moment from "moment"

export default async function profile() {
    var token = cookies().get("accessToken")?.value || ""
    var isAuth = jwtValid(token)
    let user: any = {}
    try {
        if (isAuth) {
            var id: any = jwtDecode(token);
            if (!id && id == false) return redirect("/login");
            user = await getUser(id?.id.toString())
        }
    } catch (e) {
        console.log(e)
    }
    return (<main>
        <section>
            <div className="container">
                <div className="profile-header">
                    <img src="/image/Myu.webp" alt="Foto Profil" title="Foto Profil" />
                    <h1><span>{user?.name}</span></h1>
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
                    <h2>Pengaturan Privasi</h2>
                    <p>Siapa yang dapat melihat informasi profil:</p>
                    <p><span>Publik</span></p>
                </div>

                <div className="profile-buttons">
                    <Link href="/auth/logout" className="button">Keluar</Link>
                    <Link href="/profile/edit" className="button" prefetch={true}>Pengaturan</Link>
                </div>
            </div>

        </section>
    </main>);
}
