import { FilePlus, Home, PieChart } from "react-feather";

const menu = [
  {
    id: "informasi_view",
    title: "Informasi",
    icon: <Home size={20} />,
    navLink: "/informasi",
  },
  {
    id: "usulan_view",
    title: "Pengusulan",
    icon: <FilePlus size={20} />,
    navLink: "/pengusulan/list",
  },
  {
    id: "konreg_view",
    title: "Konreg Pool",
    icon: <FilePlus size={20} />,
    navLink: "/konregpool/list",
  },
  {
    id: "prioritas_view",
    title: "Prioritas",
    icon: <FilePlus size={20} />,
    navLink: "/prioritas/list",
  },
  {
    id: "penetapan_view",
    title: "Penetapan",
    icon: <FilePlus size={20} />,
    navLink: "/penetapan/list",
  },
  {
    id: "rekapitulasi_view",
    title: "Rekapitulasi",
    icon: <PieChart size={20} />,
    navLink: "/rekapitulasi",
  },
];

export default menu;
