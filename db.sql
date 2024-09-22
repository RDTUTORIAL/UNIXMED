-- / / TABEL USER
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM(
        'patient',
        'doctor',
        'admin',
        'pharmacist'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- / / TABEL SIAPA AJA YANG SUBS
CREATE TABLE subscriptions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- / / TABEL OBAT APA AJA YG DIJUAL
CREATE TABLE medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 3) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- / / TABEL GIMANA ORDERAN OBATNYA
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    medication_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    status ENUM(
        'pending',
        'shipped',
        'delivered',
        'canceled',
        'success'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (medication_id) REFERENCES medications (id)
);

-- / / TABEL APOTEK MANA AJA YANG TER - INTEGRASI
CREATE TABLE pharmacies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- / / TABEL OBAT APA AJA YANG ADA DI APOTEKNYA TU
CREATE TABLE medication_pharmacy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id INT NOT NULL,
    pharmacy_id INT NOT NULL,
    price DECIMAL(10, 3) NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (medication_id) REFERENCES medications (id),
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
);

-- / / TABEL DOKTER
CREATE TABLE doctors (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) UNIQUE NOT NULL,
    specialty VARCHAR(255),
    qualifications TEXT,
    experience TEXT,
    rating FLOAT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- / / REVIEW ATAU TESTI BUAT DOKTERNYa
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    rating INT CHECK (
        rating >= 1
        AND rating <= 5
    ),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users (id),
    FOREIGN KEY (patient_id) REFERENCES users (id)
);