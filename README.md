# Person Management System

Bu proje, SENG 384 dersi için geliştirilmiş bir full-stack web uygulamasıdır. 
React (Vite), Node.js (Express), ve PostgreSQL kullanılarak geliştirilmiş olup, Docker Compose ile kapsayıcı (container) mimarisine alınmıştır.

## Kullanılan Teknolojiler
- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Node.js, Express.js
- **Veritabanı**: PostgreSQL
- **Altyapı**: Docker & Docker Compose

## Kurulum ve Çalıştırma

1. Bilgisayarınızda Docker ve Docker Compose'un kurulu, Docker Desktop'ın açık olduğundan emin olun.
2. Proje ana dizininde bir terminal açın.
3. Aşağıdaki komutu çalıştırarak projeyi derleyip başlatın:
   ```bash
   docker compose up --build
   ```
4. Uygulama ayağa kalktıktan sonra tarayıcınızdan şu linklere gidebilirsiniz:
   - **Web Arayüzü**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api/people`

## API Uç Noktaları (Endpoints)

| Metod | Adres | Açıklama |
| --- | --- | --- |
| GET | `/api/people` | Tüm kişileri listeler |
| GET | `/api/people/:id` | Sadece belirli bir kişiyi getirir |
| POST | `/api/people` | Yeni kişi ekler |
| PUT | `/api/people/:id` | Var olan kişiyi günceller |
| DELETE| `/api/people/:id` | Kişiyi siler |

