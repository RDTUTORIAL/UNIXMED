import Image from "next/image";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { headers } from "next/headers"
import { notFound } from 'next/navigation';
import pool from "@/lib/db";
import moment from "moment";
import 'moment/locale/id';

moment.locale('id');
const Navbar = dynamic(() => import('@/components/navBar'), { ssr: false });

interface PostPageProps {
    params: {
        title: string;
    };
}

export default async function ArtikelPage({ params }: PostPageProps) {
    const { title } = params;
    var titleExt = title?.split("-")
    var titleExt2 = titleExt.join(" ")
    var results = await pool.query(`SELECT * FROM article WHERE title = '${titleExt2}'`)
    var row: any = results.rows[0]
    if(results.rows?.length < 1) return notFound();
    return (<div>
        <header>
            <Navbar />
        </header>
        <main>
            <div className="artikel-page">
                <div className="artikel-container">
                    <h1 className="judul-artikel">{row.title}</h1>
                    <p className="keterangan-artikel">Ditulis oleh <span>{row.auhtor}</span> | {moment(row.create_at).format("LLLL")}</p>
                    <img src={row.image} alt={"Gambar-"+row.title?.replace(/ /g, "-")} className="gambar-artikel" />
                    <div className="isi-artikel" dangerouslySetInnerHTML={{ __html: row.html }} />
                </div>
            </div>

        </main>
        <footer>
            <p>Copyright 2024&copy;Unix Team</p>
        </footer>
    </div>);
}
