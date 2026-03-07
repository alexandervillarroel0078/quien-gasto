// import { Route } from "react-router-dom";
// import PrestamosList from "../modulos/prestamo/page/PrestamosList";

// export default (
//   <Route path="/prestamos" element={<PrestamosList />} />
// );
import { Route } from "react-router-dom";

import DeudasList from "../modulos/prestamo/page/DeudasList";
import DeudaDetalle from "../modulos/prestamo/page/DeudaDetalle";

export default (

  <>
    <Route path="/deudas" element={<DeudasList />} />
    <Route path="/deudas/:deudor_id/:acreedor_id" element={<DeudaDetalle />} />
  </>

);