// ** Third Party Components
import {
  Table,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { Printer } from "react-feather";
import { sasaranTransform } from "@utils/Usulan";
import exportToExcel from "./shared/exportToExcel";

const RususSasaranDetail = (props) => {
  const { sasarans } = props;

  async function handleExportLocation(e) {
    e.preventDefault();
    e.stopPropagation();
    const columns = [
      { header: "No", key: "no", width: 12 },
      { header: "Kecamatan", key: "kecamatan", width: 64 },
      { header: "Desa", key: "desa", width: 64 },
      { header: "Jumlah Unit", key: "jumlahUnit", width: 24 },
    ];

    const dataSource = sasarans.map((item, index) => ({
      no: index + 1,
      kecamatan: item.Kecamatan.nama,
      desa: item.Desa.nama,
      jumlahUnit: parseInt(item.jumlahUnit) || 0,
    }));

    await exportToExcel({
      filename: "Daftar Lokasi",
      columns,
      dataSource,
    });
  }
  return (
    <UncontrolledAccordion
      defaultOpen="lokasi"
      className="shadow mb-2"
      style={{ borderRadius: "0.428rem" }}
    >
      <AccordionItem>
        <AccordionHeader targetId="lokasi" className="title-accordion-text">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "100%", paddingRight: "1rem" }}
          >
            Lokasi
            <span
              className="btn btn-primary btn-sm"
              tabIndex={-1}
              role="button"
              onClick={handleExportLocation}
            >
              <Printer size={14} /> Export Lokasi
            </span>
          </div>
        </AccordionHeader>
        <AccordionBody accordionId="lokasi">
          <Table size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Kecamatan</th>
                <th>Desa</th>
                <th>Jumlah Unit</th>
              </tr>
            </thead>
            <tbody>
              {sasarans.map((item, index) => {
                const data = sasaranTransform(item);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data?.Kecamatan?.nama}</td>
                    <td>{data?.Desa?.nama}</td>
                    <td>{Number(data?.jumlahUnit || 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default RususSasaranDetail;
