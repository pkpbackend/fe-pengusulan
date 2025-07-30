// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
import { useSelector } from "react-redux";

const CustomFooter = () => {
  const handleShowEnvy = () => {
    const { REACT_APP_NODE_ENV, API_HOST, PORT } = process.env;
    alert(`
    REACT_APP_NODE_ENV: ${REACT_APP_NODE_ENV}
    API_HOST: ${API_HOST}
    PORT: ${PORT}
    `);
  };

  return (
    <p className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">
        <span onClick={handleShowEnvy}>
          COPYRIGHT © {new Date().getFullYear()}{" "}
        </span>
        <a
          href="https://perumahan.pu.go.id"
          target="_blank"
          rel="noopener noreferrer"
        >
          DIREKTORAT JENDERAL PERUMAHAN
        </a>
      </span>
      <span className="float-md-end d-none d-md-block">v3.0.0</span>
    </p>
  );
};

const VerticalLayout = (props) => {
  const accessMenu = useSelector((state) => state.auth.user?.Role?.accessMenu);
  const menu = navigation.filter(
    (menu) =>
      accessMenu?.includes(menu.id) ||
      menu.id === "informasi_view" ||
      menu.id === "rekapitulasi_view"
  );
  return (
    <Layout menuData={menu ?? []} footer={<CustomFooter />} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
