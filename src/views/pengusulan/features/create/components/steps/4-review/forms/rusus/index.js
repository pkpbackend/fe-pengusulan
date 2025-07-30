import { Fragment, useCallback, useEffect } from "react";

// Third party components
import moment from "moment";
import { ArrowLeft, ArrowRight } from "react-feather";
import "intersection-observer";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Table, Button } from "reactstrap";

import {
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
} from "../../../../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const FormRusus = (props) => {
  const navigate = useNavigate();

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
        typeUsulan: "rusus",
        jenisData: formData.jenisData.value,
        noSurat: formData.noSurat,
        tahunUsulan: formData.tahunUsulan,
        tanggalSurat: moment(formData.tanggalSurat).format("YYYY-MM-DD"),

        nik: formData.nikPicPengusul,
        namaPicPengusul: formData.namaPicPengusul,
        jabatanPicPengusul: formData.jabatanPicPengusul,
        telpPicPengusul: formData.telpPicPengusul,
        emailPicPengusul: formData.emailPicPengusul,

        instansi: formData.instansiPengusul,
        alamatInstansi: formData.alamatInstansiPengusul,

        ProvinsiId: formData.provinsi.id,
        CityId: formData.kabupaten.id,

        PenerimaManfaatId: formData?.penerimaManfaat?.id,
        penerimaManfaatOther: !formData?.penerimaManfaat
          ? formData?.penerimaManfaatOther
          : "",

        jumlahUnit: formData.jumlahUnit,

        sasarans: formData.sasarans.map((sasaran) => ({
          ProvinsiId: formData.provinsi.id,
          CityId: formData.kabupaten.id,
          KecamatanId: sasaran.kecamatan.id,
          DesaId: sasaran.desa.id,
          jumlahUnit: sasaran.jumlahUnit,
          lng: sasaran.longitude,
          lat: sasaran.latitude,
        })),
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
        "Berhasil menyimpan pengusulan...",
        "success"
      );

      navigate(`/pengusulan/${resultCreate.data.id}`);
    } else if (resultCreate.isError) {
      sweetalert.fire("Oops...", resultCreate.error.data.message, "error");
    }

    if (resultUpdate.isSuccess) {
      sweetalert.fire(
        "Ubah Berhasil",
        "Berhasil mengubah pengusulan...",
        "success"
      );

      navigate(`/pengusulan/${resultUpdate.data.id}`);
    } else if (resultUpdate.isError) {
      sweetalert.fire("Oops...", resultUpdate.error.data.message, "error");
    }
  }, [resultCreate, resultUpdate]);

  return (
    <Fragment>
      <Row>
        <Col md="6" className="mb-1">
          <h5>Jenis Pengusulan</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head-first">Tipe Pengusulan</td>
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
                <td className="row-head-first">Nama PIC Pengusul</td>
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
                <td>{formData.tahunUsulan}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <h4>Sasaran/Lokasi</h4>
          <hr className="mb-0"></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head-first">Penerima Manfaat</td>
                <td>{formData.penerimaManfaat?.tipe || "-"}</td>
              </tr>
              {Number(formData.penerimaManfaat?.id) === 9999 && (
                <tr>
                  <td className="row-head">Keterangan Penerima Manfaat</td>
                  <td>{formData.penerimaManfaatOther || "-"}</td>
                </tr>
              )}
              <tr>
                <td className="row-head">Provinsi</td>
                <td>{formData.provinsi?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kabupaten</td>
                <td>{formData.kabupaten?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jumlah Unit</td>
                <td>
                  <strong>
                    {Number(formData.jumlahUnit).toLocaleString() || "0"}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="12">
          <h5>Lokasi</h5>
          <hr style={{ marginBottom: 0 }}></hr>
          <Table size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Kecamatan</th>
                <th>Desa</th>
                <th>Jumlah Unit</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {formData?.sasarans?.map((sasaran, index) => (
                <tr key={sasaran.desa.nama}>
                  <td>{index + 1}</td>
                  <td>{sasaran.kecamatan.nama}</td>
                  <td>{sasaran.desa.nama}</td>
                  <td>{sasaran.jumlahUnit}</td>
                  <td>{sasaran.latitude}</td>
                  <td>{sasaran.longitude}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
        >
          <span className="align-middle d-sm-inline-block d-none">
            Selanjutnya
          </span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default FormRusus;
