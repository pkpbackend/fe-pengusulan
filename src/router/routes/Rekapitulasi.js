// ** React Imports
import { lazy } from "react";

const Rekap = lazy(() => import("@views/rekapitulasi/features/list"));

const RekapRoutes = [
  {
    element: <Rekap />,
    path: "/rekapitulasi",
  },
];

export default RekapRoutes;
