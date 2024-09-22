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
    let step = 1;
    $('div[class="w-full lg:w-3/5 lg:pr-4 lg:pl-4 xl:w-3/5 xl:pr-4 xl:pl-4 pt-4 sm:pt-2 px-0 md:pl-12 md:pr-4"]').each(function (a, b) {
        $(b).find('div[class="property"] > div[class="property-container w-full"]').each(function (anu, RA) {
            var text1 = $(RA).find('div').text().trim()
            if (text1 == '') return
            hasil.push(text1)
            // step == 1 && text2.includes("deskripsi") ? hasil.push(text1) : hasil.push("-");
            // ++step
            // step == 2 && text2.includes("indikasi") ? hasil.push(text1) : hasil.push("-");
            // ++step
            // step == 3 && text2.includes("komposisi") ? hasil.push(text1) : hasil.push("-");
            // ++step
            // step == 4 && text2.includes("deskripsi") ? hasil.push(text1) : hasil.push("-");
            // ++step
            // step == 5 && text2.includes("deskripsi") ? hasil.push(text1) : hasil.push("-");
            // ++step
            // step == 6 && text2.includes("deskripsi") ? hasil.push(text1) : hasil.push("-");
            // ++step

        })
    })
    console.log(hasil)
    // console.log(title, price, tiap, hasil)
    const newMedication = {
        name: title,
        harga: parsePrice(price),
        stock: 10,
        tiap: tiap?.replace("PER", "")?.toUpperCase(),
        desc: hasil[0],
        indikasi: hasil[1],
        komposisi: hasil[2],
        dosis: hasil[3],
        aturan: hasil[4],
        perhatian: hasil[5],
        kontra: hasil[6],
        efek_samping: hasil[7],
        golongan: hasil[8],
        kemasan: hasil[9],
        manufaktur: hasil[10],
        no_reg: hasil[11],
        image: img
    };
    return newMedication
};

async function insertMedication(data) {
    try {
        const query = `
      INSERT INTO obat 
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
    data.forEach(async(x) => {
        var res = await obat(x.slug)
        console.log(res)
        insertMedication(res)
    });
}

run()
