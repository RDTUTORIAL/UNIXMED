// Interface untuk tabel users
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'patient' | 'doctor' | 'admin' | 'pharmacist';
    created_at?: Date;
    updated_at?: Date;
}

// Interface untuk tabel subscriptions
export interface Subscription {
    id: string;
    user_id: string;
    start_date: string; // Menggunakan string untuk tipe DATE
    end_date: string;   // Menggunakan string untuk tipe DATE
    active: boolean;
}

// Interface untuk tabel medications
export interface Medication {
    id: number;
    name: string;
    description?: string;
    price: number;  // DECIMAL(10,3) cocok menggunakan number
    stock: number;
    created_at: Date;
    updated_at: Date;
}

// Interface untuk tabel orders
export interface Order {
    id: number;
    user_id: string;
    medication_id: number;
    quantity: number;
    total_price: number; // DECIMAL(10,2) cocok menggunakan number
    delivery_address: string;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled' | 'success';
    created_at: Date;
    updated_at: Date;
}

// Interface untuk tabel pharmacies
export interface Pharmacy {
    id: number;
    name: string;
    address: string;
    contact_number?: string;
    created_at: Date;
    updated_at: Date;
}

// Interface untuk tabel medication_pharmacy
export interface MedicationPharmacy {
    id: number;
    medication_id: number;
    pharmacy_id: number;
    price: number;  // DECIMAL(10,3) cocok menggunakan number
    stock: number;
}

// Interface untuk tabel doctors
export interface Doctor {
    id: number;
    user_id: number;
    specialty?: string;
    qualifications?: string;
    experience?: string;
    rating: number;
}

// Interface untuk tabel reviews
export interface Review {
    id: number;
    doctor_id: string;
    patient_id: string;
    rating: number;  // Rating 1-5
    comment?: string;
    created_at: Date;
}
