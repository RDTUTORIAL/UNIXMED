const pool = require("./db")
const fs = require("fs")
async function insertMedication(data) {
    try {
        const query = `
      INSERT INTO pharmacies 
      (nama, alamat, nomor_telepon, jam_buka, link_iframe)
      VALUES 
      ('${data.nama}', '${data.alamat}', '${data.nomor_telepon}', '${data.jam_buka}', '${data.link_iframe}')
      RETURNING *;
    `;
        console.log(query)
        // Execute the query
        const result = await pool.query(query);

        console.log("Data berhasil ditambahkan:", result.rows[0]);
    } catch (error) {
        console.error("Error saat menambahkan data:", error);
    }
}

function run(){
    var data = JSON.parse(fs.readFileSync("./apotek.json"))
    data.forEach(x => {
        insertMedication(x)
    });
}

run()