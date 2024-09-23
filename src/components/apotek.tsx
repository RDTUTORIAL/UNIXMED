import React from 'react';

const formatAlamat = (alamat: string) => {
  if (alamat.length <= 83) {
    return alamat.padEnd(83, ' ');
  }
  
  const firstLine = alamat.slice(0, 83);
  const secondLine = alamat.slice(83);
  return (
    <>
      <p>{firstLine}</p>
      <p>{secondLine}</p>
    </>
  );
};

const ApotekSection: React.FC<{ result: { rows: any[] } }> = ({ result }) => {
  return (
    <div className="apotek-section">
      {result.rows.length > 1 ? (
        result.rows.map((res: any, index: number) => (
          <div className="apotek-terdekat" key={index}>
            <div className="lokasi-apotek">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.793015509779!2d115.19979627458218!3d-8.615860691429868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23fe80eb6157d%3A0xd7f8aca24632484f!2sApotek%20Padma!5e0!3m2!1sid!2sid!4v1726141748644!5m2!1sid!2sid" 
                width="400" 
                height="300" 
                style={{border:0}} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="apotek-detail">
              <h1>{res.nama}</h1>
              {formatAlamat(res.alamat)}
              <h2>{res.jam_buka}</h2>
              <p>{res.nomor_telepon}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Tidak ada hasil ditemukan.</p>
      )}
    </div>
  );
};

export default ApotekSection;