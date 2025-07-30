// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Routes Imports
import PengusulanRoutes from "./Pengusulan";
import PrioritasRoutes from "./Prioritas";
import NotifikasiRoutes from "./Notifikasi";
import KonregPoolRoutes from "./KonregPool";
import PenetapanRoutes from "./Penetapan";
import RekapitulasiRoutes from "./Rekapitulasi";
import ChildRoutes from "./Child";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import PrivateRoute from "@src/@core/components/routes/PrivateRoute";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Sistem Informasi Bantuan Perumahan";

// ** Default Route
const DefaultRoute = "/informasi";

const Information = lazy(() => import("../../views/informasi"));
const Error = lazy(() => import("../../views/Error"));
const NotAuthorized = lazy(() => import("../../views/NotAuthorized"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/informasi",
    element: <Information />,
  },
  {
    path: "/not-authorized",
    element: <NotAuthorized />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  ...PengusulanRoutes,
  ...PrioritasRoutes,
  ...NotifikasiRoutes,
  ...KonregPoolRoutes,
  ...PenetapanRoutes,
  ...ChildRoutes,
  ...RekapitulasiRoutes,
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PrivateRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);
    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });

  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
