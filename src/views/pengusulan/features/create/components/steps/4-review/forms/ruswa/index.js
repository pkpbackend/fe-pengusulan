import { Fragment, useCallback, useEffect, useRef } from "react";

// Third party components
import moment from "moment";
import { ArrowLeft, ArrowRight } from "react-feather";
import "intersection-observer";
import { useIsVisible } from "react-is-visible";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Table, Button } from "reactstrap";
import LeafletMaps from "../../components/LeafletMaps";

import {
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
} from "../../../../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const FormRuswa = (props) => {
  const navigate = useNavigate();
  const nodeRef = useRef();
  const isVisible = useIsVisible(nodeRef);

  // ** props
  const {
    stepper,
    form: { formData },
  } = props;

  const isRegularForm =
    formData.jenisData?.value === 1 || formData.jenisData?.value === 5;

  const [createUsulan, resultCreate] = useCreateUsulanMutation();
  const [updateUsulan, resultUpdate] = useUpdateUsulanMutation();

  const memoizedCreateUsulan = useCallback(() => {
    const saving = async () => {
      let data = {
        typeUsulan: "swadaya",
        jenisData: formData.jenisData.value,
        tahunUsulan: formData.tahunUsulan,
        noSurat: formData.noSurat,
        tanggalSurat: moment(formData.tanggalSurat).format("YYYY-MM-DD"),

        nik: formData.nikPicPengusul,
        namaPicPengusul: formData.namaPicPengusul,
      };
      if (isRegularForm) {
        data = {
          ...data,
          telpPicPengusul: formData.telpPicPengusul,
          emailPicPengusul: formData.emailPicPengusul,
          jabatanPicPengusul: formData.jabatanPicPengusul,

          instansi: formData.instansiPengusul,
          alamatInstansi: formData.alamatInstansiPengusul,

          ttdBupati: formData.ttdSuratUsulan,

          PenerimaManfaatId: formData?.penerimaManfaat?.id,
          jumlahUnitPk: formData.jumlahUnitPk,
          ProvinsiId: formData.provinsi.id,
          CityId: formData.kabupaten.id,

          sasarans: formData.sasarans.map((sasaran) => ({
            id: sasaran?.id || undefined,
            ProvinsiId: formData.provinsi.id,
            CityId: formData.kabupaten.id,
            MasterKegiatanId: sasaran.jenisKegiatan.id,
            KecamatanId: sasaran.kecamatan.id,
            DesaId: sasaran.desa.id,
            jumlahUnit: sasaran.jumlahUnit,
            rtlh: sasaran.jumlahRtlh,
            lng: sasaran.longitude,
            lat: sasaran.latitude,
          })),
        };
      } else {
        data = {
          ...data,
          sasarans: formData.sasarans.map((sasaran) => ({
            id: sasaran?.id || undefined,
            ProvinsiId: sasaran.provinsi.id,
            jumlahUnit: sasaran.jumlahUnit,
          })),
          jumlahUnit: formData.jumlahUnit,
        };
      }
      if (formData.id) {
        updateUsulan({ id: formData.id, ...data });
      } else {
        createUsulan(data);
      }
    };

    saving();
  }, [formData, createUsulan, updateUsulan, isRegularForm]);

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
        "Berhasil mengubah pengusulan",
        "success"
      );
      navigate(`/pengusulan/${resultUpdate.data.id}`);
    } else if (resultUpdate.isError) {
      sweetalert.fire("Oops...", resultUpdate.error.data.message, "error");
    }
  }, [navigate, resultCreate, resultUpdate]);

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
                <td className="row-head-first">NIK PIC Pengusul</td>
                <td>{formData.nikPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head-first">Nama PIC Pengusul</td>
                <td>{formData.namaPicPengusul || "-"}</td>
              </tr>
              {isRegularForm ? (
                <>
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
                    <td className="row-head">
                      Alamat Instansi/Lembaga Pengusul
                    </td>
                    <td>{formData.alamatInstansiPengusul || "-"}</td>
                  </tr>
                </>
              ) : null}

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
              {isRegularForm ? (
                <tr>
                  <td className="row-head">Penandatangan Surat Usulan</td>
                  <td>{formData.ttdSuratUsulan}</td>
                </tr>
              ) : null}
              <tr>
                <td className="row-head">Tahun Anggaran</td>
                <td>{formData.tahunUsulan || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      {isRegularForm ? (
        <>
          <Row>
            <Col md="12" className="mb-1">
              <h4>Sasaran/Lokasi</h4>
              <hr></hr>
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-1">
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Penerima Manfaat</td>
                    <td>{formData.penerimaManfaat?.tipe || "-"}</td>
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
                    <td className="row-head">Peningkatan Kualitas (PK)</td>
                    <td>
                      {formData.jumlahUnitPk
                        ? Number(formData.jumlahUnitPk).toLocaleString()
                        : "0"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <div ref={nodeRef}>
            {formData?.sasarans?.map((sasaran, index) => {
              return (
                <div key={index}>
                  <hr></hr>
                  <h4 style={{ marginLeft: 10 }}>Sasaran {index + 1}</h4>
                  <Row>
                    <Col md="6" className="mb-1">
                      <Table size="sm" responsive>
                        <tbody>
                          <tr>
                            <td className="row-head-first">Jenis Kegiatan</td>
                            <td>{sasaran.jenisKegiatan?.name || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head-first">Kecamatan</td>
                            <td>{sasaran.kecamatan?.nama || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Desa</td>
                            <td>{sasaran.desa?.nama || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah RTLH</td>
                            <td>
                              {sasaran.jumlahRtlh
                                ? Number(sasaran.jumlahRtlh).toLocaleString()
                                : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah Unit</td>
                            <td>
                              {sasaran.jumlahUnit
                                ? Number(sasaran.jumlahUnit).toLocaleString()
                                : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td className="row-head">Latitude</td>
                            <td>{sasaran.latitude || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Longitude</td>
                            <td>{sasaran.longitude || "-"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md="6" className="mb-1">
                      {isVisible && (
                        <LeafletMaps
                          latitude={parseFloat(sasaran.latitude)}
                          longitude={parseFloat(sasaran.longitude)}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Row>
            <Col md="12">
              <h5>Detail Kawasan</h5>
              <hr></hr>
            </Col>
          </Row>
          <div>
            {formData?.sasarans?.map((sasaran, index) => {
              return (
                <div key={index} className="mb-1">
                  <h6 style={{ marginLeft: 10 }}>Sasaran {index + 1}</h6>
                  <hr className="mb-0"></hr>
                  <Row>
                    <Col md="12">
                      <Table size="sm" responsive>
                        <tbody>
                          <tr>
                            <td className="row-head-first">Provinsi</td>
                            <td>{sasaran.provinsi?.nama || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah Unit</td>
                            <td>
                              {Number(sasaran.jumlahUnit).toLocaleString() ||
                                "0"}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              );
            })}
            <hr></hr>
            <Row>
              <Col md="12" className="mb-1">
                <Table size="sm" responsive>
                  <tbody>
                    <tr>
                      <td className="row-head-first">
                        <h5 className="mb-1">Total Usulan</h5>
                      </td>
                      <td>
                        <div className="mb-1">
                          <strong>
                            {Number(formData.jumlahUnit).toLocaleString() ||
                              "0"}
                          </strong>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </>
      )}

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

export default FormRuswa;
