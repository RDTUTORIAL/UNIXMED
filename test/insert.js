const pool = require('./db'); // Mengimpor koneksi dari file db.ts
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs")

async function obat(nama, id) {
  console.log(`https://www.alodokter.com/aloshop/products/${nama}/${id}`)
  const respon = await axios.request(`https://www.alodokter.com/aloshop/products/${nama}/${id}`, {
    method: "GET",
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "cache-control": "max-age=0",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
      "cookie": `_gcl_au=1.1.966539449.1725514832; _fbp=fb.1.1725514832524.596193857379800118; _gid=GA1.2.815699965.1726993643; _gac_UA-52179504-1=1.1726993643.Cj0KCQjwgL-3BhDnARIsAL6KZ6_bLZBFUxyerTnkUoJGnODt-ywhy6KXzWnwVintGXJYHKFBmD4eB9kaArONEALw_wcB; __gads=ID=41d85fed49b4a63d:T=1726993644:RT=1726993644:S=ALNI_MbpJ0OvOVYUIXMZdS5NcMkbUTGMEQ; __gpi=UID=00000f13f7ecfe20:T=1726993644:RT=1726993644:S=ALNI_MakL8CFTv56bpwnaugwo8qcJ4VTxA; __eoi=ID=fb07a867a9760ef2:T=1726993644:RT=1726993644:S=AA-AfjYIPVNAtHWS7EGFJfh6x0XX; _gcl_gs=2.1.k1$i1726993639; _gcl_aw=GCL.1726993647.Cj0KCQjwgL-3BhDnARIsAL6KZ6_bLZBFUxyerTnkUoJGnODt-ywhy6KXzWnwVintGXJYHKFBmD4eB9kaArONEALw_wcB; _ga=GA1.1.423199889.1725514832; cto_bundle=srUENF96Q3dnTE5rJTJGR3N3RTZiSmlkUVI0NTE1ZHVJNDN4QVlDc0JMcXBjQUdtUVpzciUyQk50TDNWdHhyVFdCRTdOakE1N1g3dWFPVTg0b1Q1UkQ5WG5HT3Z6VHdSa2dSbSUyRkdiWHZaTEJRWXhsVXlDMVptNjNpcXpGbGxHa0thQ2lhaW5wQzZzWGdoWk9lcTR0clc2M2ZwUGlyWVNERDZKaFFRbFo2cUdHSUNyTWlNTFFCZHZLJTJCNEltVzBWOWRqb25DV3dUZlVGVGhnWE5tVm43NFJsTHpGY0plSXclM0QlM0Q; _ga_KWBXCQMQ95=GS1.2.1726997758.3.1.1726998800.60.0.0; previous_url=/aloshop/products/Geriavita-30-Kapsul/665532c9f34cdf0024882f6b; _new_alodokter_session=FEGUsv2KOLFjVggPJkRfJZw5djPf2HW9EEpS8TbveDQMnQBjdQhoNMpQx3TDy6OeiGuVInWxuig1hahxJRB4mAClhRO5Ed3udTqn7a9WGXrrREO6DhhQCRzezeWLEgWgFw8heI2jxh1KKJYINTGepKM8jcG6LRd%2B97mqLdJsDWDX7kflU4m8yEODfYRvNKom1%2FlEgvn4s6LpOU8bA5QjDPUmqwjTlsXbYvh%2Bd8BS6K%2Fdy5gg9izcoxkON0HvVHTdf6XrvR0w3%2BCTwfoTdb42vCx3xs6KeHZ%2BZPxIM%2F3N--COVAgGEeBoL5tY4M--AIixfHVNHhZyY8mkFT9r9Q%3D%3D; SERVERID=alodokter_app_kube|Zu/pF|Zu/lA; _ga_4BDJ4W10QK=GS1.1.1726997758.4.1.1726998810.0.0.0`
    }
  })
  const $ = cheerio.load(respon.data)
  fs.writeFileSync("./a.html", respon.data)
  let title = $('.product-title.fw-700.font-24').text().trim()
  let price = $('.product-price.fw-700.font-24.c-orange').text().trim()
  let tiap = $('.product-pack.fw-400.font-14.c-grey.d-flex').text().trim().replace("per ").toUpperCase()
  let img = $('.container > .d-flex > img').attr("src")
  let hasil = []
  const hal = []
  const intr = []
  $('#description').each(function (a, b) {
    $(b).find('p').each(function (anu, RA) {
      var text1 = $(RA).find("span:nth-child(1)").text().trim()
      var text2 = $(RA).find("span:nth-child(2)").text().trim()
      var text3 = $(RA).find("span:nth-child(3)").text().trim()
      var text4 = $(RA).find("span:nth-child(4)").text().trim()
      var text5 = $(RA).find("span:nth-child(5)").text().trim()
      console.log(text1, text2, text3, text4, text5)
      if (text1 != '') hasil.push(text1)
      if (text2 != '') hasil.push(text2)
      if (text3 != '') hasil.push(text3)
      if (text4 != '') hasil.push(text4)
      if (text5 != '') hasil.push(text5)
    })
  })
  $('#description').each(function (a, b) {
    $(b).find('ul:nth-child(14) > li').each(function (anu, RA) {
      var text = $(RA).find("span").text().trim()
      hal.push(text)
    })
  })
  let dosis = $('#description > :nth-child(17)').text().trim()
  let cara1 = $('#description > p:nth-child(20) > span').text().trim()
  let cara2 = $('#description > p:nth-child(21) > span').text().trim()
  let cara3 = $('#description > p:nth-child(22) > span').text().trim()
  $('#description').each(function (a, b) {
    $(b).find('ul:nth-child(25) > li').each(function (anu, RA) {
      var text = $(RA).find("span").text().trim()
      intr.push(text)
    })
  })
  let efek1 = $('#description > p:nth-child(28) > span').text().trim()
  let efek2 = $('#description > p:nth-child(29) > span').text().trim()
  let nilaiTanpaSimbol = price.replace("Rp", "").replace(".", "");
  let nilaiInteger = Number(nilaiTanpaSimbol);
  var obj = {
    name: title,
    harga: nilaiInteger,
    stock: 10,
    tiap,
    fungsi: hasil[0],
    komposisi: hasil[hasil.findIndex(x => x.includes("Komposisi")) + 1]?.replace(/Komposisi/g, ""),
    golongan: hasil[hasil.findIndex(x => x.includes("Golongan")) + 1],
    kategori: hasil[hasil.findIndex(x => x.includes("Kategori")) + 1]?.replace(/Kategori/g, "").replace(/\s+/g, ""),
    bentuk_obat: hasil[hasil.findIndex(x => x.includes("Bentuk Obat")) + 1]?.replace(/Bentuk/g, "").replace(/\s+/g, ""),
    kemasan: hasil[hasil.findIndex(x => x.includes("Kemasan")) + 1]?.replace(/Kemasan/g, ""),
    pabrik: hasil[hasil.findIndex(x => x.includes("Pabrik/Manufaktur")) + 1]?.replace(/Pabrik\/Manufaktur/g, ""),
    no_bpom: hasil[hasil.findIndex(x => x.includes("No. BPOM")) + 1]?.replace(/No. BPOM/g, "").replace(/ /g, ""),
    hal_yang_perlu_diperhatikan: hal,
    interaksi_dengan_obat_lain: intr,
    dosis_aturan: dosis,
    cara_mengonsumsi: cara1 + cara2 + cara3,
    efek_samping: efek1 + efek2,
    image: img
  };
  return obj
};

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

async function run() {
  let data = JSON.parse(fs.readFileSync("./data.json"))
  // var id = "61d696c5e139ec066bb26e47"
  // var name = "Blackmores Multi B Performance 30 Tablet"
  for (let i = 0; i < data.length; i++){
    console.log(`https://www.alodokter.com/aloshop/products/${data[i].name.replace(/\s+/g, "-")}/${data[i].id}`)
  }
  // console.log({
  //   ...dataa,
  //   efek_samping_serius: '',
  //   keterangan_khusus: null
  // })
  // insertMedication({
  //   ...dataa,
  //   efek_samping_serius: '',
  //   keterangan_khusus: null
  // }, 11);
}

run()
// obat().then(console.log)
// Menjalankan fungsi insert
// insertMedication(newMedication);
