import { useEffect, Fragment, useCallback } from "react";

// Third party components
import moment from "moment";
import { ArrowLeft, ArrowRight } from "react-feather";
import "intersection-observer";
import IsVisible from "react-is-visible";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Table, Button } from "reactstrap";
import LeafletMaps from "../../components/LeafletMaps";

import {
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
} from "../../../../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const FormPengembang = (props) => {
  const navigate = useNavigate();

  // ** props
  const {
    stepper,
    form: { formData },
  } = props;
  const [createUsulan, resultCreate] = useCreateUsulanMutation();
  const [updateUsulan, resultUpdate] = useUpdateUsulanMutation();

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

  const memoizedCreateUsulan = useCallback(() => {
    const saving = async () => {
      let data = {
        typeUsulan: "psu-pp",
        jenisData: formData.jenisData.value,
        type: formData.type?.value || 8,

        tahunBantuanPsu: formData.tahunBantuanPsu,
        noSurat: formData.noSurat,
        tanggalSurat: moment(formData.tanggalSurat).format("YYYY-MM-DD"),

        PengembangId: formData.pengembang.id,
        nik: formData.nikPicPengusul,
        namaPicPengusul: formData.namaPicPengusul,
        telpPicPengusul: formData.telpPicPengusul,
        perusahaanPengusul: formData.perusahaanPengusul,
        asosiasiPengusul: formData.asosiasiPengusul,
        namaDirekturPengusul: formData.namaDirekturPengusul,
        telpDirekturPengusul: formData.telpDirekturPengusul,
        emailPengusul: formData.emailPengusul,
        alamatPengusul: formData.alamatPengusul,
        ProvinsiIdPengusul: formData.provinsiPengusul.id,
        CityIdPengusul: formData.kabupatenPengusul.id,
        KecamatanIdPengusul: formData.kecamatanPengusul.id,
        DesaIdPengusul: formData.desaPengusul.id,

        namaPerumahan: formData.namaPerumahan,
        alamatLokasi: formData.alamatPerumahan,
        ProvinsiId: formData.provinsi.id,
        CityId: formData.kabupaten.id,
        KecamatanId: formData.kecamatan.id,
        DesaId: formData.desa.id,
        longitude: formData.longitude,
        latitude: formData.latitude,

        dayaTampung: formData.dayaTampung,
        jumlahUsulan: formData.jumlahUsulan,

        bentukBantuan:
          formData?.bentukBantuan?.length > 0
            ? formData.bentukBantuan.map((bentukBantuan, index) => ({
                prioritas: index + 1,
                bentukBantuan: bentukBantuan.bantuan,
              }))
            : null,
        dokumenSbu: formData.dokumenSbu === 1 ? formData.fileDokumenSbu : null,
        isNewSbu: formData.isNewSbu,
      };

      if (formData.jenisData.value === 7) {
        data = {
          ...data,
          // Proporsi Jumlah Rumah
          proporsiJml: {
            jmlRumahUmum: formData.jmlRumahUmum,
            presentaseRumahUmum: formData["jmlRumahUmumPersentase"],
            jmlRumahMenengah: formData.jmlRumahMenengah,
            presentaseRumahMenengah: formData["jmlRumahMenengahPersentase"],
            jmlRumahMewah: formData.jmlRumahMewah,
            presentaseRumahMewah: formData["jmlRumahMewahPersentase"],
          },
          rumahTerbangun: {
            jmlRumahUmum: formData.jmlRumahUmumTerbangun,
            presentaseRumahUmum: formData["jmlRumahUmumTerbangunPersentase"],
            jmlRumahMenengah: formData.jmlRumahMenengahTerbangun,
            presentaseRumahMenengah:
              formData["jmlRumahMenengahTerbangunPersentase"],
            jmlRumahMewah: formData.jmlRumahMewahTerbangun,
            presentaseRumahMewah: formData["jmlRumahMewahTerbangunPersentase"],
          },
        };
      }

      if (formData.id) {
        updateUsulan({ ...data, id: formData.id });
      } else {
        createUsulan(data);
      }
    };

    saving();
  }, [formData, createUsulan, updateUsulan]);

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
          <h5>Data Pengembang</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">Nama Pengembang</td>
                <td>{formData?.pengembang?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama Perusahaan</td>
                <td>{formData?.pengembang?.namaPerusahaan || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nomor HP</td>
                <td>{formData?.pengembang?.telpPenanggungJawab || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">NPWP</td>
                <td>{formData?.pengembang?.npwp || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Email</td>
                <td>{formData?.pengembang?.email || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md="6" className="mb-1">
          <h5>Data Pengusul</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">NIK PIC Perusahaan Pengusul</td>
                <td>{formData.nikPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama PIC Perusahaan Pengusul</td>
                <td>{formData.namaPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. HP PIC Perusahaan Pengusul</td>
                <td>{formData.telpPicPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama Perusahaan</td>
                <td>{formData.perusahaanPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama Asosiasi</td>
                <td>{formData.asosiasiPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama Direktur</td>
                <td>{formData.namaDirekturPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. HP Direktur</td>
                <td>{formData.telpDirekturPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Email Perusahaan</td>
                <td>{formData.emailPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Alamat Perusahaan</td>
                <td>{formData.alamatPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Provinsi</td>
                <td>{formData.provinsiPengusul?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kabupaten</td>
                <td>{formData.kabupatenPengusul?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kecamatan</td>
                <td>{formData.kecamatanPengusul?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Desa</td>
                <td>{formData.desaPengusul?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. Surat Pengusulan</td>
                <td>{formData.noSurat || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Tanggal Surat Pengusulan</td>
                <td>
                  {formData.tanggalSurat
                    ? moment(formData.tanggalSurat).format("DD-MM-YYYY")
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="row-head">Tahun Anggaran</td>
                <td>{formData.tahunBantuanPsu || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="6" className="mb-1">
          <h5>Data Perumahan</h5>
          <hr></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">Nama Perumahan</td>
                <td>{formData.namaPerumahan || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Alamat Perumahan</td>
                <td>{formData.alamatPerumahan || "-"}</td>
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
          <IsVisible once>
            {() => {
              return (
                <LeafletMaps
                  latitude={parseFloat(formData.latitude)}
                  longitude={parseFloat(formData.longitude)}
                />
              );
            }}
          </IsVisible>
        </Col>
      </Row>
      <hr />
      <Row>
        {formData?.type?.value === 7 ? (
          <>
            <Col md="6" className="mb-1">
              <h5>Total Proporsi Rumah</h5>
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Jumlah Rumah Umum</td>
                    <td>
                      {Number(formData.jmlRumahUmum || 0).toLocaleString()} Unit
                      |{" "}
                      {Number(
                        formData["jmlRumahUmumPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Jumlah Rumah Menengah</td>
                    <td>
                      {Number(formData.jmlRumahMenengah || 0).toLocaleString()}{" "}
                      Unit |{" "}
                      {Number(
                        formData["jmlRumahMenengahPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Jumlah Rumah Mewah</td>
                    <td>
                      {Number(formData.jmlRumahMewah || 0).toLocaleString()}{" "}
                      Unit |{" "}
                      {Number(
                        formData["jmlRumahMewahPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md="6" className="mb-1">
              <h5>Total Rumah Terbangun</h5>
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Jumlah Rumah Umum</td>
                    <td>
                      {Number(
                        formData.jmlRumahUmumTerbangun || 0
                      ).toLocaleString()}{" "}
                      Unit |{" "}
                      {Number(
                        formData["jmlRumahUmumTerbangunPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Jumlah Rumah Menengah</td>
                    <td>
                      {Number(
                        formData.jmlRumahMenengahTerbangun || 0
                      ).toLocaleString()}{" "}
                      Unit |{" "}
                      {Number(
                        formData["jmlRumahMenengahTerbangunPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Jumlah Rumah Mewah</td>
                    <td>
                      {Number(
                        formData.jmlRumahMewahTerbangun || 0
                      ).toLocaleString()}{" "}
                      Unit |{" "}
                      {Number(
                        formData["jmlRumahMewahTerbangunPersentase"] || 0
                      ).toLocaleString()}{" "}
                      %
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </>
        ) : null}
        <Col md="6" className="mb-1">
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head">Daya Tampung Keseluruhan</td>
                <td>
                  {Number(formData.dayaTampung || 0).toLocaleString()} Unit
                </td>
              </tr>
              <tr>
                <td className="row-head">Jumlah Usulan</td>
                <td>
                  {Number(formData.jumlahUsulan || 0).toLocaleString()} Unit
                </td>
              </tr>
              <tr>
                <td className="row-head">Bentuk Bantuan</td>
                <td>
                  {formData.bentukBantuan?.map((item, index) => {
                    return (
                      <div key={index}>
                        <span>
                          Prioritas {index + 1} - {item.bantuan || ""}
                        </span>
                        <br></br>
                      </div>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td className="row-head">File SBU</td>
                <td>
                  {formData.dokumenSbu === 1 ? "Ya" : "Tidak"}
                  {formData.dokumenSbu === 1 && (
                    <>
                      <br></br>
                      <span>
                        File: {formData.fileDokumenSbu.name}{" "}
                        {formData.isNewSbu && "(baru)"}
                      </span>
                    </>
                  )}
                </td>
              </tr>
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

export default FormPengembang;
