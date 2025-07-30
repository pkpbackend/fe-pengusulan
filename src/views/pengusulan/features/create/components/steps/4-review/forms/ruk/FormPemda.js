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
import LeafletMapViewMultipleMarker from "../../components/LeafletMapViewMultipleMarker";

import {
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
} from "../../../../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const FormPemda = (props) => {
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
      let data = {
        typeUsulan: "psu-pd",
        jenisData: formData.jenisData.value,
        type: formData.type.value,

        tahunBantuanPsu: formData.tahunBantuanPsu,
        noSurat: formData.noSurat,
        tanggalSurat: moment(formData.tanggalSurat).format("YYYY-MM-DD"),

        nik: formData.nikPicPengusul,
        namaPicPengusul: formData.namaPicPengusul,
        jabatanPicPengusul: formData.jabatanPicPengusul,
        telpPicPengusul: formData.hpPicPengusul,
        emailPicPengusul: formData.emailPicPengusul,

        instansi: formData.instansiPengusul,
        alamatInstansi: formData.alamatInstansiPengusul,

        namaPerumahan: formData.namaPerumahan,
        alamatLokasi: formData.alamatPerumahan,
      };

      if (formData.type.value === 6) {
        data = {
          ...data,
          namaKelompokMbr: formData.namaKelompokMbr,

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
        };
      } else {
        data = {
          ...data,
          noSuratKeputusanDaerah: formData.noSuratKeputusanDaerah,
          ProvinsiId: formData.provinsi.id,
          CityId: formData.kabupaten.id,

          UsulanLokasi:
            formData?.lokasi?.length > 0
              ? formData.lokasi.map((lokasi) => ({
                  id: lokasi?.id || undefined,
                  KecamatanId: lokasi.kecamatan.id,
                  DesaId: lokasi.desa.id,
                  lat: lokasi.latitude,
                  lng: lokasi.longitude,
                }))
              : null,

          luasanDelinasi: formData.luasanDelinasi,
          dayaTampung: formData.dayaTampung,

          // Proporsi Jumlah Rumah
          proporsiJml: {
            jmlRumahUmum: formData.jmlRumahUmum,
            presentaseRumahUmum: formData.jmlRumahUmumPersentase,
            jmlRumahMenengah: formData.jmlRumahMenengah,
            presentaseRumahMenengah: formData.jmlRumahMenengahPersentase,
            jmlRumahMewah: formData.jmlRumahMewah,
            presentaseRumahMewah: formData.jmlRumahMewahPersentase,
          },
          rumahTerbangun: {
            jmlRumahUmum: formData.jmlRumahUmumTerbangun,
            presentaseRumahUmum: formData.jmlRumahUmumTerbangunPersentase,
            jmlRumahMenengah: formData.jmlRumahMenengahTerbangun,
            presentaseRumahMenengah:
              formData.jmlRumahMenengahTerbangunPersentase,
            jmlRumahMewah: formData.jmlRumahMewahTerbangun,
            presentaseRumahMewah: formData.jmlRumahMewahTerbangunPersentase,
          },

          UsulanPerumahan:
            formData?.perumahan?.length > 0
              ? formData.perumahan.map((perumahan) => ({
                  id: perumahan?.id || undefined,
                  namaPerumahan: perumahan.namaPerumahan,
                  jmlRumahUmum: perumahan.jmlRumahUmum,
                  presentaseRumahUmum: perumahan["jmlRumahUmumPersentase"],
                  jmlRumahMenengah: perumahan.jmlRumahMenengah,
                  presentaseRumahMenengah:
                    perumahan["jmlRumahMenengahPersentase"],
                  jmlRumahMewah: perumahan.jmlRumahMewah,
                  presentaseRumahMewah: perumahan["jmlRumahMewahPersentase"],
                }))
              : null,

          jumlahUsulan: formData.jumlahUsulan,
          bentukBantuan:
            formData?.bentukBantuan?.length > 0
              ? formData.bentukBantuan.map((bentukBantuan, index) => ({
                  prioritas: index + 1,
                  bentukBantuan: bentukBantuan.bantuan,
                  besertaDrainase:
                    bentukBantuan.bersertaDrainase === "Ya" ? true : false,
                }))
              : null,

          dimensiJalan: {
            panjang: formData.panjangJalanUsulan,
            lebar: formData.lebarJalanUsulan,
          },
          statusJalan: formData.statusJalan,
          detailStatus: formData?.detailStatus,
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
                <td className="row-head">No. HP PIC Pengusul</td>
                <td>{formData.hpPicPengusul || "-"}</td>
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
                <td>{formData.tahunBantuanPsu || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {Number(formData?.type?.value) === 5 && (
        <>
          <Row className="mb-1">
            <Col md="12">
              <hr></hr>
              <h5>Data Perumahan Skala Besar</h5>
              <hr className="mb-0"></hr>
            </Col>
            <Col md="12">
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Nama Perumahan</td>
                    <td>{formData.namaPerumahan || "-"}</td>
                  </tr>
                  <tr>
                    <td className="row-head">
                      No. Surat Keputusan Kepala Daerah
                    </td>
                    <td>{formData.noSuratKeputusanDaerah || "-"}</td>
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
                    <td className="row-head">Kabupaten/Kota</td>
                    <td>{formData.kabupaten?.nama || "-"}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md="6">
              <LeafletMapViewMultipleMarker
                coordinates={
                  formData?.lokasi?.map((lokasi) => ({
                    latitude: lokasi?.latitude,
                    longitude: lokasi?.longitude,
                    displayText: (
                      <div>
                        Desa: {lokasi?.desa?.nama} <br />
                        Kecamatan: {lokasi?.kecamatan?.nama}
                      </div>
                    ),
                  })) ?? []
                }
                style={{ height: "400px" }}
              />
            </Col>
            <Col md="6">
              <div
                style={{
                  height: 400,
                  overflow: "auto",
                }}
              >
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ position: "sticky", top: 0 }}>Latitude</th>
                      <th style={{ position: "sticky", top: 0 }}>Longitude</th>
                      <th style={{ position: "sticky", top: 0 }}>Kecamatan</th>
                      <th style={{ position: "sticky", top: 0 }}>Desa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.lokasi?.map((lokasi, index) => {
                      return (
                        <tr key={lokasi?.desa?.nama}>
                          <td>{lokasi?.latitude || "-"}</td>
                          <td>{lokasi?.longitude || "-"}</td>
                          <td>{lokasi?.kecamatan?.nama || "-"}</td>
                          <td>{lokasi?.desa?.nama || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12" className="mb-1">
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Luasan Delineasi</td>
                    <td>
                      {Number(formData.luasanDelinasi || 0).toLocaleString()} Ha
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Daya Tampung Keseluruhan</td>
                    <td>
                      {Number(formData.dayaTampung || 0).toLocaleString()} Unit
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
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
          </Row>
          <hr></hr>
          <Row>
            <Col md="12">
              <h5>Daftar Perumahan</h5>
            </Col>
            <hr />
            {formData?.perumahan?.map((perumahan, index) => {
              return (
                <Col key={index} sm="12" md="6">
                  <h6 style={{ marginLeft: 10, marginBottom: 0 }}>
                    Perumahan {index + 1}
                  </h6>
                  <Row>
                    <Col md="12" className="mb-1">
                      <hr className="mb-0"></hr>
                      <Table size="sm" responsive>
                        <tbody>
                          <tr>
                            <td className="row-head-first">Nama Perumahan</td>
                            <td>{perumahan.namaPerumahan || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah Rumah Umum</td>
                            <td>
                              {Number(
                                perumahan.jmlRumahUmum || 0
                              ).toLocaleString()}{" "}
                              Unit |{" "}
                              {Number(
                                perumahan["jmlRumahUmumPersentase"] || 0
                              ).toLocaleString()}{" "}
                              %
                            </td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah Rumah Menengah</td>
                            <td>
                              {Number(
                                perumahan.jmlRumahMenengah || 0
                              ).toLocaleString()}{" "}
                              Unit |{" "}
                              {Number(
                                perumahan["jmlRumahMenengahPersentase"] || 0
                              ).toLocaleString()}{" "}
                              %
                            </td>
                          </tr>
                          <tr>
                            <td className="row-head">Jumlah Rumah Mewah</td>
                            <td>
                              {Number(
                                perumahan.jmlRumahMewah || 0
                              ).toLocaleString()}{" "}
                              Unit |{" "}
                              {Number(
                                perumahan["jmlRumahMewahPersentase"] || 0
                              ).toLocaleString()}{" "}
                              %
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
          <hr></hr>
          <Row>
            <Col md="6" className="mb-1">
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Jumlah Usulan</td>
                    <td>
                      {Number(formData.jumlahUsulan || 0).toLocaleString()} Unit
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Dimensi Jalan</td>
                    <td>
                      Panjang:{" "}
                      {Number(
                        formData.panjangJalanUsulan || 0
                      ).toLocaleString()}{" "}
                      meter
                      <br></br>
                      Lebar:{" "}
                      {Number(
                        formData.lebarJalanUsulan || 0
                      ).toLocaleString()}{" "}
                      meter
                    </td>
                  </tr>
                  <tr>
                    <td className="row-head">Status Jalan</td>
                    <td>
                      {formData.statusJalan || "-"}
                      {formData.statusJalan === "Milik Pemda" && (
                        <>
                          <br></br>({formData.detailStatus || "-"})
                        </>
                      )}
                      {formData.statusJalan === "Lainnya" && (
                        <>
                          <br></br>({formData.detailStatus || "-"})
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md="6" className="mb-1">
              <div style={{ marginLeft: 10 }}>
                <h4>Bentuk Bantuan</h4>
                {formData?.bentukBantuan?.map((bantuan, index) => {
                  return (
                    <div key={index}>
                      <span>{index + 1}.</span>
                      <span style={{ marginLeft: 7 }}>
                        {bantuan.bantuan || ""}{" "}
                        {bantuan.bersertaDrainase === "Ya"
                          ? "(Drainase: Ya)"
                          : "(Drainase: Tidak)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </>
      )}
      {Number(formData?.type?.value) === 6 && (
        <>
          <Row>
            <Col md="12">
              <hr></hr>
              <h5>Data Perumahan Selain Skala Besar</h5>
              <hr></hr>
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-1">
              <Table size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="row-head-first">Nama Perumahan</td>
                    <td>{formData.namaPerumahan || "-"}</td>
                  </tr>
                  <tr>
                    <td className="row-head">Nama Kelompok MBR</td>
                    <td>{formData.namaKelompokMbr || "-"}</td>
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
                    <td className="row-head">Kabupaten/Kota</td>
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

          <Row>
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
                      {formData?.bentukBantuan?.length > 0
                        ? formData.bentukBantuan.map((bentukBantuan, index) => (
                            <div>
                              - Prioritas {index + 1}: {bentukBantuan.bantuan}
                            </div>
                          ))
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
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

export default FormPemda;
