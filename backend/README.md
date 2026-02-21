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


PERSONAS

GET    /personas
POST   /personas
PUT    /personas/{id}
PATCH  /personas/{id}/desactivar
PATCH  /personas/{id}/activar


CATEGORÍAS DE GASTO
GET    /categorias-gasto
POST   /categorias-gasto
PUT    /categorias-gasto/{id}
PATCH  /categorias-gasto/{id}/desactivar
PATCH  /categorias-gasto/{id}/activar

PERÍODOS
GET    /periodos
POST   /periodos
PATCH /periodos/{id}
PATCH  /periodos/{id}/cerrar
PATCH  /periodos/{id}/reabrir
GET    /periodos/{id}/resumen

APORTES
GET    /aportes
POST   /aportes
PUT    /aportes/{id}
PATCH  /aportes/{id}/anular

GASTOS
GET    /gastos
POST   /gastos
PUT    /gastos/{id}
PATCH  /gastos/{id}/anular

REPORTES 
GET /reportes/balance
GET /reportes/aportes
GET /reportes/gastos
GET /reportes/periodos/{id}/balance
GET /reportes/personas
GET /reportes/gastos/categorias
GET /reportes/periodos/comparar
