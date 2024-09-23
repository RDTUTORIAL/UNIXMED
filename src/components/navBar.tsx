"use client"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [isAuth, setIsAuth] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();

    useEffect(() => {
        fetch('/auth/verifyToken')
            .then((res) => res.json())
            .then((data) => {
                setIsAuth(data.valid);
            })
            .catch(() => {
                setIsAuth(false);
            });
    }, []);

    const handleLoginClick = () => {
        router.push('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            e.preventDefault();
            router.push(`/obat?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav>
            <Link className="logo" href="/">
                <h3 className="logotype">UnixMed</h3>
            </Link>
            <div className="list">
                <ul>
                    <li className="satu"><Link href="/" prefetch={true}>Beranda</Link></li>
                    <li className="dua"><Link href="/artikel" prefetch={true}>Artikel</Link></li>
                    <li className="tiga"><Link href="/obat" prefetch={true}>Obat</Link></li>
                    <li className="hamburger" onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#20245e">
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                        </svg>
                    </li>
                </ul>
                {isSidebarVisible && (
                    <ul className="sidebar">
                        <li className="side-satu"><Link href="/" prefetch={true}>Beranda</Link></li>
                        <li className="side-dua"><Link href="/artikel" prefetch={true}>Artikel</Link></li>
                        <li className="side-tiga"><Link href="/obat" prefetch={true}>Obat</Link></li>
                        <li className="close" onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                        </li>
                    </ul>
                )}
            </div>
            <div className="search-n-login">
                <div className="search-field">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                    <input 
                        className="search" 
                        type="text" 
                        placeholder="Cari obat" 
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={handleSearchSubmit}
                    />
                </div>
                {isAuth === false ? 
                    <button className="login-btn" onClick={handleLoginClick}>Login</button> 
                    : 
                    <Link href="/profile" prefetch={true}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000">
                            <path d="M226-262q59-42.33 121.33-65.5 62.34-23.17 132.67-23.17 70.33 0 133 23.17T734.67-262q41-49.67 59.83-103.67T813.33-480q0-141-96.16-237.17Q621-813.33 480-813.33t-237.17 96.16Q146.67-621 146.67-480q0 60.33 19.16 114.33Q185-311.67 226-262Zm253.88-184.67q-58.21 0-98.05-39.95Q342-526.58 342-584.79t39.96-98.04q39.95-39.84 98.16-39.84 58.21 0 98.05 39.96Q618-642.75 618-584.54t-39.96 98.04q-39.95 39.83-98.16 39.83ZM480.31-80q-82.64 0-155.64-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.51T80-480.18q0-82.82 31.5-155.49 31.5-72.66 85.83-127Q251.67-817 324.51-848.5T480.18-880q82.82 0 155.49 31.5 72.66 31.5 127 85.83Q817-708.33 848.5-635.65 880-562.96 880-480.31q0 82.64-31.5 155.64-31.5 73-85.83 127.34Q708.33-143 635.65-111.5 562.96-80 480.31-80Zm-.31-66.67q54.33 0 105-15.83t97.67-52.17q-47-33.66-98-51.5Q533.67-284 480-284t-104.67 17.83q-51 17.84-98 51.5 47 36.34 97.67 52.17 50.67 15.83 105 15.83Zm0-366.66q31.33 0 51.33-20t20-51.34q0-31.33-20-51.33T480-656q-31.33 0-51.33 20t-20 51.33q0 31.34 20 51.34 20 20 51.33 20Zm0-71.34Zm0 369.34Z"/>
                        </svg>
                    </Link>
                }
            </div>
        </nav>
    );
}