"use client"
import React, { useState, useEffect } from 'react';
import Footer from "@/components/footer";
import Navbar from "@/components/navBar";
import formatNum from 'format-num';
import { notFound, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface PostPageProps {
    params: {
        id: string;
    };
}

const fetchObat = async (id) => {
    try {
        const res = await fetch(`/api/medications?id=${id}`);
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

export default function ObatDetailPage({ params }: PostPageProps) {
    const { id } = params;
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [deliveryMethod, setDeliveryMethod]: any = useState(null);
    const [email, setEmail] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [medication, setMedication]: any = useState([])
    const [paymentMethod, setPaymentMethod] = useState(null);

    useEffect(() => {
        if (medication[0]) return
        const loadArtikel = async () => {
            const { data } = await fetchObat(id);
            setMedication(data);
        };
        loadArtikel();
    })

    useEffect(() => {
        const newSubTotal = parseInt(medication[0]?.harga) * quantity;
        setSubTotal(newSubTotal);
        setTotal(newSubTotal + (deliveryMethod ? deliveryMethod.price : 0));
    }, [quantity, deliveryMethod, parseInt(medication.harga)]);

    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, parseInt(e.target.value) || 1));
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleDeliveryMethodChange = (method) => {
        setDeliveryMethod(method);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        if (!email || !deliveryMethod || !paymentMethod) {
            toast.error("Please fill in all required fields")
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    medicationId: medication[0]?.id,
                    quantity,
                    deliveryMethod: deliveryMethod.name,
                    paymentMethod: paymentMethod,
                    email,
                    total,
                }),
            });

            if (response.ok) {
                toast.success("checkout berhasil! terimakasih telah berbelanja disini.")
                setTimeout(() => {
                    router.push(`/obat/${medication[0].name.replace(/\s+/g, "-").toLowerCase()}`); // Redirect to a thank you page
                }, 2000)
            } else {
                toast.error("Checkout failed. Please try again.")
                alert('Checkout failed. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error("An error occurred. Please try again.")
        }
    };

    return (
        <div>
            <Toaster />
            <header>
                <Navbar />
            </header>
            <main className="checkout-container">
                <div className="checkout-page">
                    <div className="checkout-produk">
                        <h3>Informasi Produk</h3>
                        <div className="checkout-card-produk">
                            <img src={medication[0]?.image} alt="" className="foto-produk-checkout" />
                            <div className="keterangan-produk-checkout">
                                <h3 className="nama-produk-checkout">{medication[0]?.name}</h3>
                                <input
                                    type="number"
                                    id="jumlah"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <p className="per">{medication[0]?.tiap}</p>
                            </div>
                        </div>

                        <div className="pengiriman">
                            <h3>Pengiriman</h3>

                            <div className="pengiriman-card">
                                <input
                                    type="radio"
                                    id="jnt"
                                    name="delivery"
                                    value="jnt"
                                    onChange={() => handleDeliveryMethodChange({ name: 'J&T', price: 15900 })}
                                />
                                <div className="pengiriman-keterangan">
                                    <h3 className="harga-produk-checkout">Rp. <span className="harga-produk-checkout-value">{formatNum(15900)}</span></h3>
                                    <p className="estimasi-pengiriman per">Estimasi diterima, 2 - 3 hari</p>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Logo_J%26T_Merah_Square.jpg" alt="" className="gambar-pengirim" />
                            </div>

                            <div className="pengiriman-card">
                                <input
                                    type="radio"
                                    id="jne"
                                    name="delivery"
                                    value="jne"
                                    onChange={() => handleDeliveryMethodChange({ name: 'JNE', price: 10000 })}
                                />
                                <div className="pengiriman-keterangan">
                                    <h3 className="harga-produk-checkout">Rp. <span className="harga-produk-checkout-value">{formatNum(10000)}</span></h3>
                                    <p className="estimasi-pengiriman per">Estimasi diterima, 4 - 5 hari</p>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/New_Logo_JNE.png" alt="" className="gambar-pengirim" />
                            </div>
                        </div>
                    </div>

                    <div className="checkout-pembayaran">
                        <div className="pembayaran-container">
                            <div className="detail-pembayaran-checkout">
                                <h3>Detail Pembayaran</h3>
                                <p className="per">Selesaikan pembayaran dengan mengisi form dibawah ini.</p>
                            </div>

                            <div className="alamat-email-checkout">
                                <h3>Email</h3>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Masukkan Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>

                            <div className="metode-pembayaran-checkout">
                                <h3>Pilih metode pembayaran</h3>

                                <div className="metode-pembayaran-btn-container-checkout">
                                    <a className="metode-pembayaran-btn-checkout">
                                        <button
                                            className="metode-pembayaran-btn-checkout"
                                            onClick={() => handlePaymentMethodChange('shopeepay')}
                                            style={{ backgroundColor: paymentMethod === 'shopeepay' ? '#e1e2e3' : 'transparent' }}
                                        >
                                            <img src="https://1.bp.blogspot.com/-EmJLucvvYZw/X0Gm1J37spI/AAAAAAAAC0s/Dyq4-ko9Eecvg0ostmowa2RToXZITkbcQCLcBGAsYHQ/w1200-h630-p-k-no-nu/Logo%2BShopeePay.png" alt="ShopeePay" className="metode-pembayaran-img" />
                                        </button>
                                    </a>
                                    <a className="metode-pembayaran-btn-checkout">
                                        <button
                                            className="metode-pembayaran-btn-checkout"
                                            onClick={() => handlePaymentMethodChange('dana')}
                                            style={{ backgroundColor: paymentMethod === 'dana' ? '#e1e2e3' : 'transparent' }}
                                        >
                                            <img src="https://1.bp.blogspot.com/-aYApmQz2ZF4/XnK19AqNMYI/AAAAAAAASb8/UoPPqLROubECfTZbAqlX9FZJMgtVvi3OgCLcBGAsYHQ/s1600/Dana.png" alt="Dana" className="metode-pembayaran-img" />
                                        </button>
                                    </a>
                                </div>
                            </div>

                            <div className="transaksi-checkout">
                                <div className="keterangan-transaksi-checkout">
                                    <h3 className="per">Sub Total</h3>
                                    <h3>Rp. <span id="subtotal">{formatNum(subTotal)}</span></h3>
                                </div>
                                <div className="keterangan-transaksi-checkout">
                                    <h3 className="per">Diskon</h3>
                                    <h3>Rp. <span id="discount">0</span></h3>
                                </div>
                                <div className="keterangan-transaksi-checkout">
                                    <h3 className="">Total</h3>
                                    <h3>Rp. <span id="total">{formatNum(total)}</span></h3>
                                </div>

                                <button onClick={handleSubmit} className="bayar-sekarang">Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}