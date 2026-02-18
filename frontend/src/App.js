// frontend/src/App.js
import AppRoutes from "./routers/AppRoutes";


export default function App() {
  return <AppRoutes />;
}

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// /* ===================== */
// /* PÁGINAS */
// /* ===================== */
// import Login from "./pages/Login";
// import Home from "./pages/Home";

// import Clientes from "./pages/Clientes";
// import NoAutorizado from "./auth/NoAutorizado";

// /* Productos */
// import ProductosList from "./pages/productos/ProductoList";
// import ProductoNuevo from "./pages/productos/ProductoNuevo";
// import ProductoEditar from "./pages/productos/ProductoEditar";

// /* Compras */
// import CompraList from "./pages/compras/CompraList";
// import CompraNuevo from "./pages/compras/CompraNuevo";
// import CompraDetalle from "./pages/compras/CompraDetalle";

// /* Otros */
// import ProveedoresList from "./pages/proveedores/ProveedoresList";
// import VentaNueva from "./pages/ventas/VentaNueva";

// import VentasList from "./pages/ventas/VentasList";
// import ReporteList from "./modulos/reportes/pages/ReporteList";
// import VentaDetalle from "./pages/ventas/VentaDetalle";
// /* Seguridad */
// import PrivateRoute from "./auth/PrivateRoute";
// import RoleRoute from "./auth/RoleRoute";

// export default function App() {
//     return (
//         <Router>
//             <Routes>

//                 {/* ===================== */}
//                 {/* PÚBLICAS */}
//                 {/* ===================== */}
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/no-autorizado" element={<NoAutorizado />} />

//                 {/* ===================== */}
//                 {/* PRIVADAS (login requerido) */}
//                 {/* ===================== */}
//                 <Route element={<PrivateRoute />}>

//                     <Route path="/" element={<Home />} />
//                     <Route path="/clientes" element={<Clientes />} />
//                     <Route path="/proveedores" element={<ProveedoresList />} />

//                     {/* ===================== */}
//                     {/* PRODUCTOS (ADMIN + VENDEDOR) */}
//                     {/* ===================== */}
//                     <Route element={<RoleRoute roles={["ADMIN"]} />}>
//                         <Route path="/productos" element={<ProductosList />} />
//                     </Route>

//                     {/* ===================== */}
//                     {/* PRODUCTOS (SOLO ADMIN) */}
//                     {/* ===================== */}
//                     <Route element={<RoleRoute roles={["ADMIN"]} />}>
//                         <Route path="/productos/nuevo" element={<ProductoNuevo />} />
//                         <Route path="/productos/editar/:id" element={<ProductoEditar />} />
//                     </Route>

//                     {/* ===================== */}
//                     {/* COMPRAS */}
//                     {/* ===================== */}
//                     <Route element={<RoleRoute roles={["ADMIN"]} />}>
//                         <Route path="/compras" element={<CompraList />} />
//                         <Route path="/compras/nueva" element={<CompraNuevo />} />
//                         <Route path="/compras/:id" element={<CompraDetalle />} />
//                     </Route>

//                     {/* ===================== */}
//                     {/* VENTAS */}
//                     {/* ===================== */}
//                     <Route path="/ventas" element={<VentasList />} />
//                     <Route path="/ventas/nueva" element={<VentaNueva />} />

//                     <Route path="/ventas/:id" element={<VentaDetalle />} />
//                     {/* ===================== */}
//                     {/* REPORTES */}
//                     {/* ===================== */}
//                     <Route path="/reportes" element={<ReporteList />} />

//                 </Route>
//             </Routes>
//         </Router>
//     );
// }
