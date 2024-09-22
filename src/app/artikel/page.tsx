'use client';
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from "next/link";

const photosPerPage = 4;

const fetchPhotos = async (page, query = '') => {
    try {
        const res = await fetch(`/api/artikel?page=${page}&limit=${photosPerPage}&search=${query}`);
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

export default function PhotosPage() {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const lastQuery = useRef('');

    const { ref, inView } = useInView();

    const loadPhotos = useCallback(async (pageNum, query) => {
        if (loading) return;
        if (lastQuery.current == query && (lastQuery.current == '' && !(lastQuery.current == '' && searchQuery == ''))) return

        setLoading(true);
        const newPhotos = await fetchPhotos(pageNum, query);

        if (pageNum === 1) {
            setPhotos(newPhotos.data);
            setNoResults(newPhotos.data.length === 0);
        } else {
            setPhotos((prev): any => [...prev, ...newPhotos.data]);
        }

        setLoading(false);
        setHasMore(newPhotos.data.length === photosPerPage);
    }, []);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            setPage((prev) => prev + 1);
        }
    }, [inView, hasMore, loading]);

    useEffect(() => {
        const handleSearch = () => {
            setPhotos([]);
            setPage(1);
            setHasMore(true);
            setNoResults(false);
            loadPhotos(1, searchQuery);
        };

        const debounceTimer = setTimeout(() => {
            if (searchQuery != '') lastQuery.current = searchQuery;
            handleSearch();
        }, 700);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, loadPhotos]);

    useEffect(() => {
        if (page > 1) {
            loadPhotos(page, searchQuery);
        }
    }, [page, searchQuery, loadPhotos]);

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    return (<div>
        <header>
            <Navbar />
        </header>
        <main>
            <div className="search-artikel">
                <div className="search-field2">
                    <input
                        className="cari-artikel"
                        type="text"
                        placeholder="Cari Artikel"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <button className="login-btn">Cari</button>
            </div>

            <div className="container-artikel">
                <div className="container-other">

                    <div className="container-artikel2">
                        <div className="judul">
                            <h2>Artikel</h2>
                        </div>
                        <div className="isi-artikel-card">
                            {photos.length > 0 ? (
                                photos.map((photo: any) => (
                                    <Link href={"/obat/" + photo.title.replace(/\s+/g, "-").toLowerCase()} >
                                        <div className="artikel-card">
                                            <img src={photo.image} alt="" />
                                            <h3>{photo.title}</h3>
                                        </div>
                                    </Link>
                                ))
                            ) : loading ? (
                                <p>Memuat...</p>
                            ) : noResults ? (
                                <p>Tidak ada hasil ditemukan.</p>
                            ) : null}
                        </div>

                        {loading && <div className="loaddiv"><div className="loaderr"></div></div>}
                        {!loading && hasMore && <div ref={ref} style={{ height: '1px' }} />}
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <p>Copyright 2024&copy;Unix Team</p>
        </footer>
    </div>);
}