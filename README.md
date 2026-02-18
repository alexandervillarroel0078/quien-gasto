| KPI               | Fórmula         |
| ----------------- | --------------- |
| Ventas mes        | SUM(ventas)     |
| Costo productos   | SUM(costo)      |
| Margen bruto      | Ventas - costo  |
| Gastos            | SUM(gastos)     |
| **Ganancia real** | Margen - gastos |









cd frontend
npm start

cd backend
git add .
git commit -m "nuevo"
git push origin main

cd frontend
git add .
git commit -m "nuevo"
git push origin main


src/
├── api/              ← llamadas al backend
│   └── productos.ts
│
├── modules/          ← por dominio (igual que backend)
│   └── productos/
│       ├── pages/    ← pantallas
│       ├── components/ ← UI
│       ├── hooks/    ← lógica
│       └── types.ts
│
├── shared/
│   ├── components/   ← botones, tablas genéricas
│   └── layout/
│
├── routes/
│   └── AppRoutes.tsx
│
└── main.tsx
