const dataArray = [
    'Indikasi UmumIndikasi Umum Suplemen untuk membantu memelihara kesehatan rambut, kulit, dan kuku  Suplemen untuk membantu memelihara kesehatan rambut, kulit, dan kuku',
    'KomposisiKomposisi Keratin 250 mg, biotin 0,15 mg, zink 7,5 mg, tembaga 0,825 mg, vitamin B1 9 mg, vitamin B5 13,68 mg, vitamin B6 1 mg  Keratin 250 mg, biotin 0,15 mg, zink 7,5 mg, tembaga 0,825 mg, vitamin B1 9 mg, vitamin B5 13,68 mg, vitamin B6 1 mg',
    'DosisDosis umur 18 tahun keatas: 2 kapsul per hari  umur 18 tahun keatas: 2 kapsul per hari',
    'Aturan PakaiAturan Pakai Setelah makan  Setelah makan',
    'Golongan ProdukGolongan Produk Vitamin & Suplemen  Vitamin & Suplemen',
    'KemasanKemasan Dus, 5 Strip @ 6 Kapsul  Dus, 5 Strip @ 6 Kapsul',
    'ManufakturManufaktur Ferron Par Pharmaceutical  Ferron Par Pharmaceutical',
    'No. RegistrasiNo. Registrasi BPOM: SD192354311  BPOM: SD192354311'
  ];


const keys = [
    'deskripsi',
    'indikasi',
    'komposisi',
    'dosis',
    'aturan',
    'perhatian',
    'kontra',
    'efek_samping',
    'golongan',
    'kemasan',
    'manufaktur',
    'no_reg'
];

const hapus = (teks, apa) => {
    if (apa == "indikasi") return teks?.replace("Indikasi UmumIndikasi Umum ", "")
    if (apa == "komposisi") return teks?.replace("KomposisiKomposisi ", "")
    if (apa == "aturan") return teks?.replace("Aturan PakaiAturan Pakai ", "")
    if (apa == "perhatian") return teks?.replace("PerhatianPerhatian ", "")
    if (apa == "kontra") {
        return hapusKataBerulang(teks).replace("Kontra IndikasiKontra Indikasi", "")
    }
    if (apa == "efek_samping") return teks?.replace("Efek SampingEfek Samping ", "")
    if (apa == "golongan") return teks?.replace("Golongan ProdukGolongan Produk ", "")
    if (apa == "kemasan") return teks?.replace("KemasanKemasan ", "")
    if (apa == "manufaktur") return teks?.replace("ManufakturManufaktur ", "")
    if (apa == "no_reg") return teks?.slice(-12)
    if (apa == "deskripsi") return teks?.replace("DeskripsiDeskripsi ", "")
    if (apa == "dosis") return teks?.replace("DosisDosis ", "")
}

function hapusKataBerulang(teks) {
    const kataArray = teks?.split(' ');
    const kataSet = new Set();
    
    const hasil = kataArray?.filter(kata => {
      const kataBersih = kata.trim();
      if (!kataSet.has(kataBersih)) {
        kataSet.add(kataBersih);
        return true; // Ambil kata jika belum ada di Set
      }
      return false; // Lewatkan jika sudah ada
    });
  
    return hasil?.join(' ');
  }

const createProductObject = (data) => {
    const result = {};

    keys.forEach((key) => {
        if (key != "efek_samping" && key != "no_reg") {
            var index = dataArray.findIndex(x => x.toLowerCase().startsWith(key))
            if (index == -1) result[key] = "-"
            result[key] = hapus(dataArray[index], key)
        }else if(key == "efek_samping"){
            var index = dataArray.findIndex(x => x.toLowerCase().startsWith("efek samping"))
            if (index == -1) result[key] = "-"
            result[key] = hapus(dataArray[index], key)
        }else{
            var index = dataArray.findIndex(x => x.toLowerCase().startsWith("no."))
            if (index == -1) result[key] = "-"
            result[key] = hapus(dataArray[index], key)
        }
    });

    return result;
};

const productObject = createProductObject(dataArray);
console.log(productObject);
