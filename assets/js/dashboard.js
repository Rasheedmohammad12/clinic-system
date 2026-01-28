<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>Clinic System | Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    header {
      background: #1e88e5;
      color: white;
      padding: 15px;
      text-align: center;
    }
    .container {
      padding: 20px;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .card h2 {
      margin: 0;
      color: #555;
      font-size: 18px;
    }
    .card h3 {
      margin-top: 10px;
      font-size: 32px;
      color: #1e88e5;
    }
    nav {
      margin-top: 30px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    nav a {
      text-decoration: none;
      background: #1e88e5;
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
    }
    nav a:hover {
      background: #1565c0;
    }
  </style>
</head>

<body>

  <header>
    <h1>نظام إدارة العيادة</h1>
    <p>لوحة التحكم</p>
  </header>

  <div class="container">

    <div class="cards">
      <div class="card">
        <h2>عدد المرضى</h2>
        <h3 id="patientsCount">0</h3>
      </div>

      <div class="card">
        <h2>عدد الجلسات</h2>
        <h3 id="sessionsCount">0</h3>
      </div>

      <div class="card">
        <h2>إجمالي المدفوعات</h2>
        <h3 id="paymentsTotal">0 ₪</h3>
      </div>
    </div>

    <nav>
      <!-- لاحقاً نربطهم -->
      <a href="#">إضافة مريض</a>
      <a href="#">إضافة جلسة</a>
      <a href="#">المدفوعات</a>
      <a href="index.html">تسجيل خروج</a>
    </nav>

  </div>

  <!-- JS FILES -->
  <script src="assets/js/storage.js"></script>
  <script src="assets/js/dashboard.js"></script>

</body>
</html>
