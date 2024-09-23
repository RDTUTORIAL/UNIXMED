import Footer from "@/components/footer"
import Navbar from "@/components/navBar"
import pool from "@/lib/db"
import ApotekSection from "@/components/apotek"

export default async function ApotekTerdekat() {
    const result: any = await pool.query("select * from pharmacies")

    return (<div>
        <header>
            <Navbar />
        </header>
        <main>
            <div className="kategori-section">
                <div className="judul">
                    <h2>Apotek Terdekatmu</h2>
                </div>
                <div className="apotek-section">
                    {result.rows?.length > 1 ? (
                        <ApotekSection result={result} />
                    ) : (
                        <p>Tidak ada hasil ditemukan.</p>
                    )}
                </div>

            </div>
        </main>
        <Footer />
    </div>)
}