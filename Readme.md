# Task Management API

Node.js ve Express.js kullanılarak geliştirilmiş, çalışanların, projelerin ve görevlerin yönetilmesini sağlayan REST API projesidir.

## Proje Hakkında

Bu proje, bir yazılım şirketinin çalışan, proje ve görev süreçlerini yönetebilmesi amacıyla geliştirilmiştir.

Uygulama üzerinden çalışan ve proje kayıtları oluşturulabilir, güncellenebilir, listelenebilir ve silinebilir. Ayrıca görevler çalışanlara ve projelere atanabilir, görev durumları ve öncelikleri takip edilebilir.

Veriler JSON dosyalarında saklanmaktadır. API istekleri Postman kullanılarak test edilmiştir.

## Kullanılan Teknolojiler

- Node.js
- Express.js
- JavaScript
- JSON
- Postman

## Kurulum

Projeyi bilgisayarınıza indirdikten sonra aşağıdaki adımları uygulayın.

**1. Proje klasörüne girin:**

```bash
cd Task-Management-Api
```

**2. Gerekli paketleri yükleyin:**

```bash
npm install
```

**3. Sunucuyu başlatın:**

```bash
npm start
```

Sunucu başarıyla başlatıldığında terminalde aşağıdaki mesaj görüntülenir:

```text
Server is running on port 3000
```

API adresi:

```text
http://localhost:3000
```

## API Endpoint'leri

Tüm endpoint'ler `http://localhost:3000` adresi üzerinden kullanılmaktadır.

### 1. Employees (Çalışanlar)

| HTTP Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/employees` | Tüm çalışanları listeler. |
| GET | `/api/employees/:id` | ID değerine göre çalışan getirir. |
| POST | `/api/employees` | Yeni çalışan oluşturur. |
| PUT | `/api/employees/:id` | Çalışan bilgilerini günceller. |
| DELETE | `/api/employees/:id` | Çalışanı siler. |

### 2. Projects (Projeler)

| HTTP Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/projects` | Tüm projeleri listeler. |
| GET | `/api/projects/:id` | ID değerine göre proje getirir. |
| POST | `/api/projects` | Yeni proje oluşturur. |
| PUT | `/api/projects/:id` | Proje bilgilerini günceller. |
| DELETE | `/api/projects/:id` | Projeyi siler. |

### 3. Tasks (Görevler)

| HTTP Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/tasks` | Tüm görevleri listeler. |
| GET | `/api/tasks/:id` | ID değerine göre görev getirir. |
| POST | `/api/tasks` | Yeni görev oluşturur. |
| PUT | `/api/tasks/:id` | Görev bilgilerini günceller. |
| DELETE | `/api/tasks/:id` | Görevi siler. |
| GET | `/api/tasks/stats` | Görev istatistiklerini getirir. |
| GET | `/api/tasks/search?keyword=backend` | Görevlerde arama yapar. |
| GET | `/api/tasks/assignee/:name` | Belirli bir çalışanın görevlerini listeler. |

## Gelişmiş Görev Özellikleri

Görev listeleme endpoint'i üzerinden durum ve öncelik filtrelemesi yapılabilir.

**Duruma göre filtreleme:**

```http
GET /api/tasks?status=pending
```

**Önceliğe göre filtreleme:**

```http
GET /api/tasks?priority=high
```

**Görev arama:**

```http
GET /api/tasks/search?keyword=backend
```

**Çalışana göre görev listeleme:**

```http
GET /api/tasks/assignee/Ayşe%20Yılmaz
```

**Görev istatistikleri:**

```http
GET /api/tasks/stats
```

## Veri Yapısı

Proje verileri JSON dosyalarında saklanmaktadır.

- `employees.json`: Çalışan kayıtları.
- `projects.json`: Proje kayıtları.
- `tasks.json`: Görev kayıtları.

Görev kayıtları çalışan ve projelerle `employeeId` ve `projectId` alanları üzerinden ilişkilendirilir.

## Hata Yönetimi ve Loglama

Uygulamada HTTP isteklerini takip etmek amacıyla logger middleware kullanılmıştır.

İsteklerin metodu, URL bilgisi, HTTP durum kodu ve işlem süresi terminal üzerinden görüntülenebilir.

Ayrıca hatalı istekler ve bulunamayan kayıtlar için uygun HTTP durum kodları ve JSON hata mesajları döndürülmektedir.

## Test

API endpoint'lerinin test edilmesi için Postman kullanılmıştır.

Çalışan, proje ve görev işlemleri için GET, POST, PUT ve DELETE istekleri gönderilerek temel CRUD işlemleri test edilmiştir.

