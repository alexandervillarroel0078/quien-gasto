rmdir venv -Recurse -Force
python -m venv venv


pip freeze > requirements.txt

pip install -r requirements.txt

cd backend
venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

python -m seeds.seed_all


cd frontend
npm start

http://127.0.0.1:8000/docs

http://localhost:8000/public/productos.html
http://localhost:8000/public/compras.html
http://localhost:8000/public/ventas.html
http://localhost:8000/public/login.html

https://app.diagrams.net/#G19PiwZJ_G4cWxs9fJb28LCX78PqDjdYPp#%7B%22pageId%22%3A%22W8S3AiMwkQpvpO7kCDgW%22%7D

SELECT * FROM usuarios;
SELECT * FROM conductores;
SELECT * FROM productos;
SELECT * FROM pedidos;
SELECT * FROM detalles_pedido;
SELECT * FROM pagos;
SELECT * FROM historial_estados;
SELECT * FROM notificaciones;
SELECT * FROM ubicaciones;

https://github.com/alexandervillarroel0078/sitema.git

cd backend
git add .
git commit -m "nuevo"
git push origin main

cd frontend
git add .
git commit -m "nuevo"
git push origin main

1️⃣ Caja (apertura / cierre)
2️⃣ Gastos
3️⃣ Stock mínimo + alertas
4️⃣ Reportes
5️⃣ Auditoría


BAJO ACOPLAMIENTO (low coupling) :Cambios no rompen todo
ALTA COHESIÓN (high cohesion) :Todo en su lugar




┌────────────── PageLayout ───────────────┐
│                                         │
│ ┌── DocumentWorkspace ───────────────┐  │   ┌── CatalogPanel ───┐
│ │                                     │  │   │                  │
│ │ ┌─ DocumentHeader ───────────────┐ │  │   │  CatalogHeader   │
│ │ │ Cliente | Fecha | Estado | Pago │ │  │   │  (Search + Tabs)│
│ │ └────────────────────────────────┘ │  │   │                  │
│ │                                     │  │   │  CatalogList    │
│ │ ┌─ DocumentScrollArea ────────────┐ │  │   │  (Items)        │
│ │ │                                 │ │  │   │                  │
│ │ │ ┌─ LineItemsTable ────────────┐ │ │  │   │                  │
│ │ │ │ Detalle (tabla)             │ │ │  │   │                  │
│ │ │ └─────────────────────────────┘ │ │  │   │                  │
│ │ │                                 │ │  │   │                  │
│ │ │ ┌─ DocumentTotals ────────────┐ │ │  │   │                  │
│ │ │ │ Subtotal | Desc | Total     │ │ │  │   │                  │
│ │ │ └─────────────────────────────┘ │ │  │   │                  │
│ │ │                                 │ │  │   │                  │
│ │ └─────────────────────────────────┘ │  │   │                  │
│ │                                     │  │   │                  │
│ └─────────────────────────────────────┘  │   └──────────────────┘
│                                         │
└─────────────────────────────────────────┘



┌────────────── ui.page ───────────────┐
│                                      │
│ ┌── ui.layout ────────────────────┐  │
│ │                                  │  │
│ │ ┌─ ui.main ───────────────────┐ │  │   ┌─ CatalogDrawer ────┐
│ │ │                               │ │  │   │                   │
│ │ │ ┌─ ui.row ────────────────┐ │ │  │   │  Search + Tabs     │
│ │ │ │ DocumentCode             │ │ │  │   │  (PRODUCTOS /     │
│ │ │ │ DocumentDates            │ │ │  │   │   SERVICIOS)      │
│ │ │ └─────────────────────────┘ │ │  │   │                   │
│ │ │                               │ │  │   │  Lista items     │
│ │ │ ┌─ ui.body ───────────────┐ │ │  │   │  (catalogList)   │
│ │ │ │                          │ │ │  │   │                   │
│ │ │ │ ┌─ FormCard ──────────┐ │ │ │  │   │                   │
│ │ │ │ │ EntitySelect        │ │ │ │  │   │                   │
│ │ │ │ │ (Cliente)           │ │ │ │  │   │                   │
│ │ │ │ │ TextAreaField       │ │ │ │  │   │                   │
│ │ │ │ └─────────────────────┘ │ │ │  │   │                   │
│ │ │ │                          │ │ │  │   │                   │
│ │ │ │ ┌─ FormCard ──────────┐ │ │ │  │   │                   │
│ │ │ │ │ LineItemsTable      │ │ │ │  │   │                   │
│ │ │ │ │ (Detalle tabla)     │ │ │ │  │   │                   │
│ │ │ │ │                     │ │ │ │  │   │                   │
│ │ │ │ │ LineItemsSummary    │ │ │ │  │   │                   │
│ │ │ │ │ (Totales)           │ │ │ │  │   │                   │
│ │ │ │ │                     │ │ │ │  │   │                   │
│ │ │ │ │ Button Guardar      │ │ │ │  │   │                   │
│ │ │ │ └─────────────────────┘ │ │ │  │   │                   │
│ │ │ │                          │ │ │  │   │                   │
│ │ │ └──────────────────────────┘ │ │  │   │                   │
│ │ │                               │ │  │   │                   │
│ │ └───────────────────────────────┘ │  │   └───────────────────┘
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
