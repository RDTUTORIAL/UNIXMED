const puppeteer = require('puppeteer');
const pool = require('./db'); // Mengimpor koneksi dari file db.ts
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs")

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract product information using page.evaluate
    const product = await page.evaluate(() => {
        const title = document.querySelector('.product-title.fw-700.font-24')?.innerText.trim() || '';
        const price = document.querySelector('.product-price.fw-700.font-24.c-orange')?.innerText.trim() || '';
        const tiap = document.querySelector('.product-pack.fw-400.font-14.c-grey.d-flex')?.innerText.trim().replace("per ", "").toUpperCase() || '';
        const img = document.querySelector('.container > .d-flex > img')?.src || '';

        const description = document.querySelector('#description');
        const hasil = [];
        const hal = [];
        const intr = [];

        description.querySelectorAll('p').forEach(p => {
            p.querySelectorAll('span').forEach(span => {
                const text = span.innerText.trim();
                if (text) hasil.push(text);
            });
        });

        const listItems = description.querySelectorAll('ul:nth-of-type(14) > li');
        listItems.forEach(li => {
            const text = li.querySelector("span")?.innerText.trim();
            if (text) hal.push(text);
        });

        const dosis = description.children[16]?.innerText.trim() || '';
        const cara = Array.from({ length: 3 }, (_, i) => description.querySelector(`p:nth-of-type(${20 + i}) > span`)?.innerText.trim()).join(' ');

        const intrListItems = description.querySelectorAll('ul:nth-of-type(25) > li');
        intrListItems.forEach(li => {
            const text = li.querySelector("span")?.innerText.trim();
            if (text) intr.push(text);
        });

        const efek = Array.from({ length: 2 }, (_, i) => description.querySelector(`p:nth-of-type(${28 + i}) > span`)?.innerText.trim()).join(' ');

        return {
            title,
            price,
            tiap,
            img,
            hasil,
            hal,
            intr,
            dosis,
            cara,
            efek
        };
    });

    const nilaiInteger = parseInt(product.price.replace("Rp", "").replace(/\./g, ""), 10);

    const obj = {
        name: product.title,
        harga: nilaiInteger,
        stock: 10,
        tiap: product.tiap,
        fungsi: product.hasil[0],
        komposisi: product.hasil[product.hasil.findIndex(x => x.includes("Komposisi")) + 1]?.replace(/Komposisi/g, "").trim() || '',
        golongan: product.hasil[product.hasil.findIndex(x => x.includes("Golongan")) + 1],
        kategori: product.hasil[product.hasil.findIndex(x => x.includes("Kategori")) + 1]?.replace(/Kategori/g, "").trim(),
        bentuk_obat: product.hasil[product.hasil.findIndex(x => x.includes("Bentuk Obat")) + 1]?.replace(/Bentuk/g, "").trim(),
        kemasan: product.hasil[product.hasil.findIndex(x => x.includes("Kemasan")) + 1]?.replace(/Kemasan/g, "").trim(),
        pabrik: product.hasil[product.hasil.findIndex(x => x.includes("Pabrik/Manufaktur")) + 1]?.replace(/Pabrik\/Manufaktur/g, "").trim(),
        no_bpom: product.hasil[product.hasil.findIndex(x => x.includes("No. BPOM")) + 1]?.replace(/No. BPOM/g, "").trim(),
        hal_yang_perlu_diperhatikan: product.hal,
        interaksi_dengan_obat_lain: product.intr,
        dosis_aturan: product.dosis,
        cara_mengonsumsi: product.cara,
        efek_samping: product.efek,
        image: product.img
    };
    await browser.close();
    return obj
}

async function insertMedication(data, id) {
    try {
        const query = `
        INSERT INTO medicationss
        (medicationss_id, name, harga, stock, tiap, fungsi, komposisi, golongan, kategori, bentuk_obat, kemasan, pabrik, no_bpom, dosis_aturan, cara_mengonsumsi, hal_yang_perlu_diperhatikan, interaksi_dengan_obat_lain, efek_samping, efek_samping_serius, keterangan_khusus, image)
        VALUES 
        (${id}, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *;
      `;
        const values = [
            data.name,
            data.harga,
            data.stock,
            data.tiap,
            data.fungsi,
            data.komposisi,
            data.golongan,
            data.kategori,
            data.bentuk_obat,
            data.kemasan,
            data.pabrik,
            data.no_bpom,
            data.dosis_aturan,
            data.cara_mengonsumsi,
            data.hal_yang_perlu_diperhatikan,
            data.interaksi_dengan_obat_lain,
            data.efek_samping,
            data.efek_samping_serius,
            data.keterangan_khusus,
            data.image,
        ];

        // Menjalankan query
        const result = await pool.query(query, values);

        console.log("Data berhasil ditambahkan:", result.rows[0]);
    } catch (error) {
        console.error("Error saat menambahkan data:", error);
    }
}
var id = "667935b2b13a7c0024ff6807"
var name = "Blackmores Multi B Performance 30 Tablet"
var url = `https://www.alodokter.com/aloshop/products/${name.replace(/\s+/g, "-")}/${id}`
scrapeProduct(url).then(data => {
    console.log({
        ...data,
        efek_samping_serius: '',
        keterangan_khusus: null
    })
    insertMedication({
        ...data,
        efek_samping_serius: '',
        keterangan_khusus: null
    }, 11);
});
