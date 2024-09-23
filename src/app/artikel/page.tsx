"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navBar'; // Pastikan path import sesuai

const ArtikelPage = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [totalArticles, setTotalArticles] = useState(0);
    const photosPerPage = 12; // 3 artikel per card, 3 card

    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/artikel?page=${page}&limit=${photosPerPage}&search=${searchQuery}`);
            const result = await response.json();
            if (result.data.length === 0) {
                setHasMore(false);
                if (page === 1) setNoResults(true);
            } else {
                setArticles(prevArticles => [...prevArticles, ...result.data]);
                setTotalArticles(result.total);
                setHasMore(articles.length + result.data.length < result.total);
                setNoResults(false);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [page]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
        setNoResults(false);
        fetchArticles();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          // Lakukan sesuatu dengan nilai input, misalnya kirim data ke server
          handleSearch();
        }
      };
    
      const groupArticles = (articles: any[], groupSize: number) => {
        const grouped: any[][] = [];
        for (let i = 0; i < articles.length; i += groupSize) {
            grouped.push(articles.slice(i, i + groupSize));
        }
        return grouped;
    };

    const groupedArticles = groupArticles(articles, 4);

    return (
        <div>
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
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button className="login-btn" onClick={handleSearch}>Cari</button>
                </div>

                <div className="container-artikel">
                    <div className="container-other">
                        <div className="container-artikel2">
                            <div className="judul">
                                <h2>Artikel</h2>
                            </div>
                            {groupedArticles.map((group: any, groupIndex: any) => (
                                <div key={groupIndex} className="isi-artikel-card">
                                    {group.map((article: any, index: number) => (
                                        <Link href={"/artikel/" + article.title.replace(/\s+/g, "-").toLowerCase()+"/"+article.article_id} key={article.article_id}>
                                            <div className="artikel-card" ref={index === group.length - 1 && groupIndex === groupedArticles.length - 1 ? lastArticleElementRef : null}>
                                                <img src={article.image} alt={article.title} />
                                                <h3>{article.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                            {loading && <div className="loaddiv"><div className="loaderr"></div></div>}
                            {noResults && <p>Tidak ada hasil ditemukan.</p>}
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <p>Copyright 2024&copy;Unix Team</p>
            </footer>
        </div>
    )
};

export default ArtikelPage;