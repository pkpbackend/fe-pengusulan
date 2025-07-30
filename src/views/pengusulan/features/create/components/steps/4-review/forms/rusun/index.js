import { Fragment, useCallback, useEffect, useRef } from "react";

// Third party components
import moment from "moment";
import { ArrowLeft, ArrowRight } from "react-feather";
import "intersection-observer";
import { useIsVisible } from "react-is-visible";
import {
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
} from "../../../../../../../domains";

// ** Reactstrap Imports
import { Row, Col, Table, Button, Spinner } from "reactstrap";
import LeafletMaps from "../../components/LeafletMaps";
import { useNavigate } from "react-router-dom";
import sweetalert from "@src/utility/sweetalert";

const FormRusun = (props) => {
  const navigate = useNavigate();
  const nodeRef = useRef();
  const isVisible = useIsVisible(nodeRef);

  // ** props
  const {
    stepper,
    form: { formData },
  } = props;

  const [createUsulan, resultCreate] = useCreateUsulanMutation();
  const [updateUsulan, resultUpdate] = useUpdateUsulanMutation();

  const memoizedCreateUsulan = useCallback(() => {
    const saving = async () => {
      const data = {
        typeUsulan: "rusun",
        jenisData: formData.jenisData.value,
        tahunUsulan: formData.tahunUsulan,
        noSurat: formData.noSurat,
        tanggalSurat: moment(formData.tanggalSurat).format("YYYY-MM-DD"),

        nik: formData.nikPicPengusul,
        namaPicPengusul: formData.namaPicPengusul,
        jabatanPicPengusul: formData.jabatanPicPengusul,
        emailPicPengusul: formData.emailPicPengusul,
        telpPicPengusul: formData.telpPicPengusul,

        instansi: formData.instansiPengusul,
        alamatInstansi: formData.alamatInstansiPengusul,

        latitude: formData.latitude,
        longitude: formData.longitude,

        ProvinsiId: formData.provinsi.id,
        CityId: formData.kabupaten.id,
        KecamatanId: formData.kecamatan.id,
        DesaId: formData.desa.id,

        jumlahTower: formData.jumlahTower,
        jumlahUnit: formData.jumlahUnit,

        PenerimaManfaatId: formData.penerimaManfaat.id,
      };

      if (formData.id) {
        updateUsulan({ ...data, id: formData.id });
      } else {
        createUsulan(data);
      }
    };

    saving();
  }, [formData, createUsulan, updateUsulan]);

  useEffect(() => {
    if (resultCreate.isSuccess) {
      sweetalert.fire(
        "Simpan Berhasil",
        "Berhasil menyimpan pengusulan",
        "success"
      );
      navigate(`/pengusulan/${resultCreate.data.id}`);
    } else if (resultCreate.isError) {
      sweetalert.fire("Oops...", resultCreate.error.data.message, "error");
    }

    if (resultUpdate.isSuccess) {
      sweetalert.fire(
        "Ubah Berhasil",
        "Berhasil mengubah usulan bantuan...",
        "success"
      );

      navigate(`/pengusulan/${resultUpdate.data.id}`);
    } else if (resultUpdate.isError) {
      sweetalert.fire("Oops...", resultUpdate.error.data.message, "error");
    }
  }, [resultCreate, resultUpdate, navigate]);

  return (
    <Fragment>
      <Row>
        <Col md="6" className="mb-1">
          <h5>Jenis Pengusulan</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">Tipe Pengusulan</td>
                <td>{formData.jenisUsulan?.label || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jenis Pengusulan</td>
                <td>{formData.jenisData?.label || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="6" className="mb-1">
          <h5>Detail Pengusulan</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">NIK PIC Pengusul</td>
                <td>{formData.nikPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama PIC Pengusul</td>
                <td>{formData.namaPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jabatan PIC Pengusul</td>
                <td>{formData.jabatanPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Email PIC Pengusul</td>
                <td>{formData.emailPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. Telepon PIC Pengusul</td>
                <td>{formData.telpPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Instansi/Lembaga Pengusul</td>
                <td>{formData.instansiPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Alamat Instansi/Lembaga Pengusul</td>
                <td>{formData.alamatInstansiPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. Surat Permohonan</td>
                <td>{formData.noSurat || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Tanggal Surat Permohonan</td>
                <td>
                  {formData.tanggalSurat
                    ? moment(formData.tanggalSurat).format("DD-MM-YYYY")
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="row-head">Tahun Anggaran</td>
                <td>{formData.tahunUsulan || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md="12" className="mb-1">
          <h5>Sasaran/Lokasi</h5>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">Penerima Manfaat</td>
                <td>{formData.penerimaManfaat?.tipe || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jumlah Unit</td>
                <td>{Number(formData.jumlahUnit).toLocaleString() || "0"}</td>
              </tr>
              <tr>
                <td className="row-head">Jumlah Tower</td>
                <td>{Number(formData.jumlahTower).toLocaleString() || "0"}</td>
              </tr>
              <tr>
                <td className="row-head">Provinsi</td>
                <td>{formData.provinsi?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kabupaten</td>
                <td>{formData.kabupaten?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kecamatan</td>
                <td>{formData.kecamatan?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Desa</td>
                <td>{formData.desa?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Latitude</td>
                <td>{formData.latitude || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Longitude</td>
                <td>{formData.longitude || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="6" className="mb-1">
          <div ref={nodeRef}>
            {isVisible && (
              <LeafletMaps
                latitude={parseFloat(formData.latitude)}
                longitude={parseFloat(formData.longitude)}
              />
            )}
          </div>
        </Col>
      </Row>
      <div className="d-flex justify-content-between mt-1">
        <Button
          color="secondary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Sebelumnya
          </span>
        </Button>
        <Button
          type="submit"
          color="primary"
          className="btn-next"
          onClick={() => {
            memoizedCreateUsulan();
          }}
          disabled={resultCreate.isLoading || resultUpdate.isLoading}
        >
          {resultCreate.isLoading || resultUpdate.isLoading ? (
            <div>
              <span className="align-middle d-sm-inline-block d-none">
                Sedang menyimpan...
              </span>
              <Spinner size="sm" color="light" style={{ marginLeft: 10 }} />
            </div>
          ) : (
            <div>
              <span className="align-middle d-sm-inline-block d-none">
                {formData?.id ? "Ubah" : "Simpan"}
              </span>
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            </div>
          )}
        </Button>
      </div>
    </Fragment>
  );
};

export default FormRusun;
