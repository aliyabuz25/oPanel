# oPanel Admin-Only

Bu proje admin panel + backend API mimarisiyle calisir.
Public frontend yoktur. Docker kullanilmaz.

## 1. Mimari Ozeti

- Admin UI: React + Vite (`src/`)
- Backend API: Express + MySQL (`server/index.cjs`)
- Veri dosyalari: `public/` altinda JSON
- Upload yolu: `public/uploads`

Canli ortamlarda panelin API cagrilari `'/api/*'` oldugu icin panelin acildigi domainde ayni origin altinda `/api` endpointi calismalidir.

## 2. Lokal Gelistirme

Gereksinimler:

- Node.js 20+
- MySQL 8+

Kurulum:

```bash
npm install
```

Calistirma:

```bash
npm run dev
```

Bu komut iki sureci birlikte calistirir:

- `vite` (admin panel)
- `node server/index.cjs` (API)

Ayrik calistirmak icin:

```bash
npm run sys        # sadece admin panel (Vite)
npm run dev:server # sadece backend API
```

Build ve kalite:

```bash
npm run build
npm run lint
```

## 3. Ortam Degiskenleri (.env)

Kok dizinde `.env` dosyasi olusturun.

Ornek:

```env
PORT=5000

MYSQL_HOST=127.0.0.1
MYSQL_USER=opanel_user
MYSQL_PASSWORD=strong_password_here
MYSQL_DATABASE=opanel_db

JWT_SECRET=change_this_to_a_long_random_secret

# Opsiyonel
WEB_DATA_DIR=/home/CPANEL_USER/opanel/public
ADMIN_PUBLIC_DIR=/home/CPANEL_USER/opanel/public
UPLOAD_DIR=/home/CPANEL_USER/opanel/public/uploads

# Opsiyonel servisler
SMTP_ENABLED=1
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=0
SMTP_USER=notify@example.com
SMTP_PASS=...
SMTP_FROM=notify@example.com
SMTP_TO=team@example.com

LIBRETRANSLATE_URL=http://127.0.0.1:5001/translate
LIBRETRANSLATE_API_KEY=
LIBRETRANSLATE_TIMEOUT_MS=15000

WHATSAPP_ENABLED=1
WHATSAPP_API_ENDPOINT=https://hubmsgpanel.octotech.az/api/message
WHATSAPP_API_KEY=
ORGANIZER_WHATSAPP_TO=
```

Notlar:

- `MYSQL_PASSWORD` ve `JWT_SECRET` bos birakilmamalidir.
- `WEB_DATA_DIR`, `ADMIN_PUBLIC_DIR`, `UPLOAD_DIR` verilmezse backend kendi varsayilan yolunu kullanir.

## 4. cPanel Uretim Deploy Rehberi

Bu bolum cPanel `Setup Node.js App` uzerinden canliya cikis icindir.

### 4.1 Hazirlik

1. cPanel'de su kaynaklari olusturun:
- 1 adet MySQL database
- 1 adet MySQL user
- User -> database yetkileri (ALL PRIVILEGES)

2. Domain plani:
- Panelin acildigi domaine gelen `/api` istekleri Node app'e gitmelidir.
- Panel statik dosyalari ve API ayni origin altinda olmali (CORS/proxy karmasasi yasamamak icin).

### 4.2 Dosyalari Sunucuya Yukleme

1. Projeyi sunucuda bir dizine koyun:
- Ornek: `/home/CPANEL_USER/opanel`

2. Sunucuda komut calistirin:

```bash
cd /home/CPANEL_USER/opanel
npm install
npm run build
```

Build ciktilari `dist/` altina uretilir.

### 4.3 Node.js App Olusturma (cPanel)

cPanel -> `Setup Node.js App`:

- Node version: 20+ (mecburen 18 ise test ederek)
- Application mode: `Production`
- Application root: `opanel`
- Application URL: API'yi tasiyacagi path/domain
- Application startup file: `server/index.cjs`

Sonra:

- `Environment Variables` kismina `.env` degerlerini girin
- `Run NPM Install`
- `Restart App`

### 4.4 Admin Paneli Yayina Alma

Bu proje admin UI'yi `dist/` klasorune build eder.

Secenek A (onerilen):

- Paneli API ile ayni domaine yayinlayin.
- `dist/` icerigini ilgili web root'a kopyalayin.
- `/api` path'ini Node app'e reverse proxy edin.

Secenek B:

- Ayrik domain/subdomain kullanacaksaniz panelin API base yolunu ayni origin `/api` olacak sekilde routing/proxy ile cozmeyi unutmayin.

### 4.5 Upload ve Yazma Izinleri

Backend su klasorlere yazabilir olmalidir:

- `public/`
- `public/uploads/`

Sunucuda izinleri kontrol edin (cpanel kullanicisina ait olmali).

## 5. Veritabani ve Ilk Acilis

Uygulama acilisinda backend otomatik olarak temel tablolari olusturur:

- `users`
- `applications`
- `site_content`

Ilk giriste setup/login akisini admin panel uzerinden tamamlayin.

## 6. API Ozet

Temel endpointler:

- Saglik: `GET /api/health`
- Login: `POST /api/login`
- Setup: `POST /api/setup`
- Icerik: `GET/POST /api/site-content`, `GET/POST /api/site-new-struct`
- Medya: `POST /api/upload-image`
- Basvurular: `/api/applications/*`
- Sitemap: `GET /api/sitemap`

## 7. Proje Komutlari

- `npm run dev`: backend + admin gelistirme
- `npm run sys`: sadece admin panel (vite)
- `npm run dev:server`: sadece backend
- `npm run build`: production build
- `npm run lint`: eslint kontrolu

## 8. Sorun Giderme

### 8.1 `/api` 404 veya 502

- Node app ayakta mi kontrol edin.
- cPanel application URL ve proxy/path ayarlari dogru mu kontrol edin.
- `GET /api/health` ile dogrulayin.

### 8.2 Login calisiyor ama kayitlar yok

- `MYSQL_*` degiskenleri dogru mu kontrol edin.
- DB kullanicisinin yetkilerini kontrol edin.
- `server/index.cjs` loglarinda baglanti hatasini inceleyin.

### 8.3 Upload basarisiz

- `public/uploads` yazma izni var mi kontrol edin.
- Disk quota dolu mu kontrol edin.

### 8.4 Build sonrasi bos sayfa

- Build dosyalari eksiksiz kopyalandi mi kontrol edin.
- `index.html` ile `assets/*` ayni dizinde olmali.
- Tarayici cache temizleyin.

## 9. Guvenlik Kontrol Listesi

- `JWT_SECRET` guclu ve benzersiz olsun
- DB sifresini guclu tutun
- Uretimde debug/log seviyesini sinirlayin
- Gereksiz portlari disariya acmayin
- SSL zorunlu kullanin
- Periyodik yedek alin (`public/` + DB dump)

## 10. Faydali Dosyalar

- Panel girisi: `src/App.tsx`
- Sidebar/menu: `src/components/Sidebar.tsx`
- Icerik editoru: `src/pages/VisualEditor.tsx`
- Backend: `server/index.cjs`
- Sitemap: `public/sitemap.json`
- Dokumantasyon sablonu: `public/example-index.html`

