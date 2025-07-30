// ** React Imports
import { lazy } from "react";

const List = lazy(() => import("../../views/pengusulan/features/list"));
const Closed = lazy(() => import("../../views/closed"));
const Create = lazy(() => import("../../views/pengusulan/features/create"));
const Detail = lazy(() => import("../../views/pengusulan/features/detail"));
const Edit = lazy(() => import("../../views/pengusulan/features/edit"));

const PengusulanRoutes = [
  // {
  //   element: <Closed />,
  //   path: "/pengusulan/list",
  //   access: ["usulan_view"],
  // },
  {
    element: <List />,
    path: "/pengusulan/list",
    access: ["usulan_view"],
  },
  {
    element: <Create />,
    path: "/pengusulan/create",
    access: ["usulan_create"],
  },
  {
    element: <Edit />,
    path: "/pengusulan/:id/edit",
    access: ["usulan_update"],
  },
  {
    element: <Detail />,
    path: "/pengusulan/:id",
    access: ["usulan_view"],
  },
];

export default PengusulanRoutes;
