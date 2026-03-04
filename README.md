# oPanel (Admin Only)

Bu repo sadece admin paneli ve API backend'i icin var.
Public site tarafi yok, Docker da yok.

Kisaca mimari:
- Admin arayuzu: React + Vite (`src/`)
- API: Express (`server/index.cjs`)
- Veri/json dosyalari: `public/`
- Upload klasoru: `public/uploads/`

---

## Lokal Calistirma

### Gerekenler
- Node.js 20+
- MySQL 8+

### Kurulum
```bash
npm install
```

### Gelistirme modunda calistir
```bash
npm run dev
```
Bu komut hem paneli hem backend'i birlikte aciyor.

Ayrica istersen ayri ayri da calistirabilirsin:
```bash
npm run sys        # sadece panel (Vite)
npm run dev:server # sadece backend
```

Kontrol komutlari:
```bash
npm run build
npm run lint
```

---

## .env Ayarlari

Proje kokune `.env` dosyasi koy.
Asagidaki ornegi baz al:

```env
PORT=5000

MYSQL_HOST=127.0.0.1
MYSQL_USER=opanel_user
MYSQL_PASSWORD=strong_password_here
MYSQL_DATABASE=opanel_db

JWT_SECRET=change_this_to_a_long_random_secret

# Opsiyonel (vermezsen default path'ler kullanilir)
WEB_DATA_DIR=/home/CPANEL_USER/opanel/public
ADMIN_PUBLIC_DIR=/home/CPANEL_USER/opanel/public
UPLOAD_DIR=/home/CPANEL_USER/opanel/public/uploads

# Mail / bildirim (opsiyonel)
SMTP_ENABLED=1
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=0
SMTP_USER=notify@example.com
SMTP_PASS=...
SMTP_FROM=notify@example.com
SMTP_TO=team@example.com

# Ceviri servisi (opsiyonel)
LIBRETRANSLATE_URL=http://127.0.0.1:5001/translate
LIBRETRANSLATE_API_KEY=
LIBRETRANSLATE_TIMEOUT_MS=15000

# WhatsApp servis ayarlari (opsiyonel)
WHATSAPP_ENABLED=1
WHATSAPP_API_ENDPOINT=https://hubmsgpanel.octotech.az/api/message
WHATSAPP_API_KEY=
ORGANIZER_WHATSAPP_TO=
```

Onemli not:
- `MYSQL_PASSWORD` ve `JWT_SECRET` bos olmasin.

---

## cPanel'e Atma (Gercek Deploy Akisi)

Bu kisim "Setup Node.js App" kullanan klasik cPanel sunucular icin.

### 1) Once cPanel tarafini hazirla
- Bir MySQL database ac
- Bir MySQL user ac
- User'a DB yetkilerini ver (ALL PRIVILEGES)

### 2) Projeyi sunucuya yukle
Ornek klasor:
`/home/CPANEL_USER/opanel`

Sonra SSH'ta:
```bash
cd /home/CPANEL_USER/opanel
npm install
npm run build
```

### 3) cPanel -> Setup Node.js App
Asagidaki gibi tanimla:
- Node version: 20+ (mecbur kalirsan 18 deneyebilirsin)
- Application mode: `Production`
- Application root: `opanel`
- Startup file: `server/index.cjs`

Sonra:
- Environment Variables kismina `.env` degerlerini gir
- `Run NPM Install`
- `Restart App`

### 4) Admin panelini yayinla
Build dosyalari `dist/` icine cikar.

Temiz yol su:
- `dist/` icerigini web root'a koy
- Ayni domain altinda `/api` isteklerini Node app'e yonlendir

Neden?
Panel kodu API'yi `'/api/*'` diye cagiriyor. Yani ayni origin calismasi en sorunsuz hali.

### 5) Yazma izinleri
Backend su klasorlere yazabiliyor olmali:
- `public/`
- `public/uploads/`

Izinleri cPanel kullanicisi sahip olacak sekilde ayarla.

---

## Ilk Acilis ve DB

Backend acildiginda asagidaki tablolari otomatik olusturur:
- `users`
- `applications`
- `site_content`

Sonra panelden setup/login adimlarini tamamla.

Saglik kontrolu icin:
- `GET /api/health`

---

## SIk Kullanilan API'ler

- `GET /api/health`
- `POST /api/login`
- `POST /api/setup`
- `GET/POST /api/site-content`
- `GET/POST /api/site-new-struct`
- `POST /api/upload-image`
- `GET /api/sitemap`
- `/api/applications/*`

---

## Sorun Giderme (Gercek Hayat Notlari)

### `/api` 404 veya 502
- Node app calisiyor mu bak
- cPanel app URL/proxy path dogru mu bak
- `GET /api/health` donuyor mu test et

### Login oluyor ama veri gelmiyor
- `MYSQL_*` degerlerini tekrar kontrol et
- DB user yetkilerini kontrol et
- Backend loglarinda baglanti hatasi var mi bak

### Upload calismiyor
- `public/uploads` yazma izni var mi bak
- Disk quota dolu olabilir, kontrol et

### Build sonrasi beyaz ekran
- `dist/` tam kopyalandi mi kontrol et
- `index.html` ve `assets/` ayni yerde mi bak
- Tarayici cache temizleyip tekrar dene

---

## Guvenlik Kisa Liste

- Guclu bir `JWT_SECRET` kullan
- DB sifresini guclu tut
- SSL kullan
- Gereksiz acik port birakma
- Duzenli DB + `public/` yedegi al

---

## Projede En Cok Bakilan Dosyalar

- App girisi: `src/App.tsx`
- Sidebar/menu: `src/components/Sidebar.tsx`
- Icerik editoru: `src/pages/VisualEditor.tsx`
- Backend: `server/index.cjs`
- Sitemap: `public/sitemap.json`
- Ornek dokuman sayfasi: `public/example-index.html`
