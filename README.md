# Portfolio Muhamad Rafi Yulian

Website portofolio pribadi statis untuk Muhamad Rafi Yulian. Dibuat dengan HTML5, CSS3, dan JavaScript vanilla, siap di-hosting gratis melalui GitHub Pages.

## Struktur Folder

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── profile/
    ├── projects/
    ├── certificates/
    ├── cv/
    └── icons/
```

## Cara Menjalankan Lokal

1. Buka folder proyek ini di Visual Studio Code.
2. Install extension **Live Server** jika belum ada.
3. Klik kanan file `index.html`.
4. Pilih **Open with Live Server**.
5. Website akan terbuka di browser, biasanya melalui alamat seperti `http://127.0.0.1:5500`.

Website juga bisa dibuka langsung dengan double click `index.html`, tetapi Live Server lebih nyaman untuk preview saat mengedit.

## Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload semua file dan folder proyek ini ke repository tersebut.
3. Buka menu **Settings** pada repository.
4. Pilih **Pages**.
5. Pada bagian **Build and deployment**, pilih source dari branch `main` dan folder `/root`.
6. Simpan pengaturan.
7. Tunggu beberapa saat sampai GitHub menampilkan URL website.

## Catatan Edit Konten

- Foto profil berada di `assets/profile/profile.jpg`.
- Gambar project berada di `assets/projects/`.
- Gambar sertifikat berada di `assets/certificates/`.
- File CV terbaru berada di `assets/cv/CV-Muhamad-Rafi-Yulian.pdf`.
- Link sosial media masih bisa diganti langsung di bagian `Contact` pada `index.html`.

## Teknologi

- HTML5
- CSS3 dengan CSS variables dan responsive media query
- JavaScript vanilla untuk hamburger menu, active navbar, scroll animation, dan contact form alert
