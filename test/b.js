const pool = require('./db'); // Mengimpor koneksi dari file db.ts
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs")

function parsePrice(input) {
    // Regular expression to match the price format
    const regex = /Rp(\d{1,3}(?:\.\d{3})*)/g;
    const matches = [...input.matchAll(regex)];

    if (matches.length === 0) {
        throw new Error('No valid price found');
    }

    // Convert matched prices to integers
    const prices = matches.map(match => parseInt(match[1].replace(/\./g, ''), 10));

    // If there's only one price, return it
    if (prices.length === 1) {
        return prices[0];
    }
    // If there are two prices, return the average
    else if (prices.length === 2) {
        return Math.round((prices[0] + prices[1]) / 2);
    } else {
        throw new Error('Unexpected number of prices found');
    }
}


async function obat(q) {
    var respon = await axios.request(`https://www.halodoc.com/obat-dan-vitamin/${q}`, {
        method: "GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
        }
    })
    const $ = cheerio.load(respon.data)
    let title = $('h1.product-label').text().trim()
    let img = $('link[_ngcontent-halodoc-c3281109644=""]').attr("href")
    let price = $('span[_ngcontent-halodoc-c1924465305]').text().trim()
    let tiap = $('div[class="microcopy-product-detail product-unit"]').text().trim().replace("per ").toUpperCase()
    let hasil = [];
    $('div[class="w-full lg:w-3/5 lg:pr-4 lg:pl-4 xl:w-3/5 xl:pr-4 xl:pl-4 pt-4 sm:pt-2 px-0 md:pl-12 md:pr-4"]').each(function (a, b) {
        $(b).find('div[class="property"] > div[class="property-container w-full"]').each(function (anu, RA) {
            var text1 = $(RA).find('div').text().trim()
            if (text1 == '') return
            hasil.push(text1)
        })
    })
    var manufaktur = hasil.find(x => x.toLowerCase().includes("manufaktur"))?.replace("ManufakturManufaktur ", "") || ""
    var kemasan = hasil.find(x => x.toLowerCase().includes("kemasan"))?.replace("KemasanKemasan ", "") || ""
    var golongan = hasil.find(x => x.toLowerCase().includes("golongan"))?.replace("Golongan ProdukGolongan Produk ", "") || ""
    var dosis = hasil.find(x => x.toLowerCase().includes("dosis"))?.replace("DosisDosis ", "") || ""
    var indikasi = hasil.find(x => x.toLowerCase().includes("indikasi"))?.replace("Indikasi UmumIndikasi Umum ", "") || ""
    var komposisi = hasil.find(x => x.toLowerCase().includes("komposisi"))?.replace("KomposisiKomposisi ", "") || ""
    var desc = hasil.find(x => x.toLowerCase().includes("deskripsi"))?.replace("DeskripsiDeskripsi ", "") || ""
    var efek_samping = hasil.find(x => x.toLowerCase().includes("efek samping"))?.replace("Efek Samping", "") || ""
    var kontra = hasil.find(x => x.toLowerCase().includes("kontra"))?.replace("Kontra IndikasiKontra Indikasi ", "") || ""
    var perhatian = hasil.find(x => x.toLowerCase().includes("perhatian"))?.replace("PerhatianPerhatian ", "") || ""
    var aturan = hasil.find(x => x.toLowerCase().includes("aturan"))?.replace("Aturan PakaiAturan Pakai ", "") || ""


    const newMedication = {
        name: title,
        harga: parsePrice(price),
        stock: 10,
        tiap: tiap?.replace("PER", "")?.toUpperCase(),
        desc: desc.slice(0, desc?.indexOf("  ")),
        indikasi: indikasi.slice(0, indikasi?.indexOf("  ")),
        komposisi: komposisi.slice(0, komposisi?.indexOf("  ")),
        dosis: dosis.slice(0, dosis?.indexOf("  ")),
        aturan: aturan.slice(0, aturan?.indexOf("  ")),
        perhatian: perhatian.slice(0, perhatian?.indexOf("  ")),
        kontra: kontra.slice(0, kontra?.indexOf("  ")),
        efek_samping: efek_samping.slice(0, efek_samping?.indexOf("  ")),
        golongan: golongan.slice(0, golongan?.indexOf("  ")),
        kemasan: kemasan.slice(0, kemasan?.indexOf("  ")),
        manufaktur: manufaktur.slice(0, manufaktur?.indexOf("  ")),
        no_reg: hasil.find(x => x.toLowerCase().includes("no. reg"))?.slice(-11) || "",
        image: img
    };
    return newMedication
};

async function insertMedication(data) {
    try {
        const query = `
      INSERT INTO medications 
      (name, harga, stock, tiap, deskripsi, indikasi, komposisi, dosis, aturan, perhatian, kontra, efek_samping, golongan, kemasan, manufaktur, no_reg, image)
      VALUES 
      ('${data.name}', ${data.harga}, ${data.stock}, '${data.tiap}', '${data.desc}', '${data.indikasi}', '${data.komposisi}', '${data.dosis}', '${data.aturan}', '${data.perhatian}', '${data.kontra}', '${data.efek_samping}', '${data.golongan}', '${data.kemasan}', '${data.manufaktur}', '${data.no_reg}', '${data.image}')
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



async function run() {
    var data = JSON.parse(fs.readFileSync("./data.json"))
    var db = JSON.parse(fs.readFileSync("./db.json"))
    data.forEach(async(x) => {
        res = await obat(x.slug)
        console.log(res)
        db.push(res)
        fs.writeFileSync("./db.json", JSON.stringify(db, null, 2))
        insertMedication(res)
    });
}

run()
