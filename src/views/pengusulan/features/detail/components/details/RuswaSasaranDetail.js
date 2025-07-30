// ** Third Party Components
import {
  Table,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { sasaranTransform } from "@utils/Usulan";
import { Printer } from "react-feather";
import filter from "lodash/filter";
import exportToExcel from "./shared/exportToExcel";

const RuswaSasaranDetail = (props) => {
  const { locations, jenisData } = props;
  const isRegularForm = Number(jenisData) === 1 || Number(jenisData) === 5;

  async function handleExportLocation(e) {
    e.preventDefault();
    e.stopPropagation();
    const columns = isRegularForm
      ? [
          { header: "No", key: "no", width: 12 },
          { header: "Kecamatan", key: "kecamatan", width: 64 },
          { header: "Desa", key: "desa", width: 64 },
          { header: "Jumlah Unit", key: "jumlahUnit", width: 24 },
          { header: "Jumlah RTLH", key: "jumlahRTLH", width: 24 },
        ]
      : [
          { header: "No", key: "no", width: 12 },
          { header: "Provinsi", key: "provinsi", width: 64 },
          { header: "Jumlah Unit", key: "jumlahUnit", width: 24 },
        ];
    const data = isRegularForm
      ? filter(locations, {
          MasterKegiatanId: 1,
        })
      : locations;
    const dataSource = data.map((item, index) => {
      const jumlahRTLH =
        // dataRTLH?.find((rtlh) => Number(rtlh.DesaId) === item.DesaId)?.count ||
        0;

      return {
        no: index + 1,
        provinsi: item.Provinsi?.nama,
        kecamatan: item.Kecamatan?.nama,
        desa: item.Desa?.nama,
        jumlahUnit: parseInt(item?.jumlahUnit) || 0,
        jumlahRTLH: parseInt(jumlahRTLH) || 0,
      };
    });

    await exportToExcel({
      filename: isRegularForm
        ? "Daftar Lokasi Peningkatan Kualitas"
        : "Daftar Lokasi",
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
              {isRegularForm ? (
                <tr>
                  <th>#</th>
                  <th>Kecamatan</th>
                  <th>Desa</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Jumlah RTLH</th>
                  <th>Jumlah Unit</th>
                </tr>
              ) : (
                <tr>
                  <th>#</th>
                  <th>Provinsi</th>
                  <th>Jumlah Unit</th>
                </tr>
              )}
            </thead>
            <tbody>
              {locations.map((item, index) => {
                const data = sasaranTransform(item);
                return (
                  <tr key={data.id}>
                    {isRegularForm ? (
                      <>
                        <td>{index + 1}</td>
                        <td>{data?.Kecamatan?.nama}</td>
                        <td>{data?.Desa?.nama}</td>
                        <td>{data?.latitude}</td>
                        <td>{data?.longitude}</td>
                        <td>
                          {Number(data?.rtlh || 0).toLocaleString()}
                        </td>
                        <td>
                          {Number(data?.jumlahUnit || 0).toLocaleString()}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{index + 1}</td>
                        <td>{data?.Provinsi?.nama}</td>
                        <td>
                          {Number(data?.jumlahUnit || 0).toLocaleString()}
                        </td>
                      </>
                    )}
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

export default RuswaSasaranDetail;
