// ** Custom Components
import { JENIS_DATA_USULAN, TIPE_USULAN } from "@constants/usulan";

// ** Third Party Components
import _ from "lodash";
import moment from "moment";
import React from "react";
import { Table, Button } from "reactstrap";
import LeafletMaps from "@customcomponents/LeafletMaps";
import "../../detail.scss";
import VerminDetail from "./shared/VerminDetail";
import LeafletMapViewMultipleMarker from "../../../create/components/steps/4-review/components/LeafletMapViewMultipleMarker";
import LinkS3 from "../../../../../../components/LinkS3";

const RukDetail = (props) => {
  const { usulan } = props;
  const isPemda = Number(usulan.jenisData) !== 7;

  const dataPerusahaan = usulan?.Perusahaan || null;
  const listTableDataPengusulPengembang = [
    { title: "NIK PIC", value: usulan?.nik },
    { title: "Nama PIC", value: usulan?.picPengusul },
    { title: "No. HP PIC", value: dataPerusahaan?.telpPenanggungJawab },
    { title: "Instansi", value: dataPerusahaan?.name },
    { title: "Asosiasi", value: dataPerusahaan?.asosiasi },
    { title: "Nama Direktur", value: dataPerusahaan?.namaDirektur },
    { title: "No HP Direktur", value: dataPerusahaan?.telpDirektur },
    { title: "Email PIC", value: dataPerusahaan?.email },
    { title: "Alamat Instansi", value: dataPerusahaan?.alamat },
    { title: "Provinsi", value: dataPerusahaan?.Provinsi?.nama },
    { title: "Kabupaten/Kota", value: dataPerusahaan?.City?.nama },
    { title: "Kecamatan", value: dataPerusahaan?.Kecamatan?.nama },
    { title: "Desa/Kelurahan", value: dataPerusahaan?.Desa?.nama },
  ];
  const listTableDataPerumahanPengembang = [
    { title: "Nama Perumahan", value: usulan?.namaPerumahan },
    { title: "Alamat Perumahan", value: usulan?.alamatLokasi },
    {
      title: "Provinsi",
      value: usulan?.Provinsi?.nama || "",
    },
    {
      title: "Kabupaten/Kota",
      value: usulan?.City?.nama || "",
    },
    {
      title: "Kecamatan",
      value: usulan?.Kecamatan?.nama || "",
    },
    {
      title: "Desa/Kelurahan",
      value: usulan?.Desa?.nama || usulan?.desaLainnya,
    },
    {
      title: "Koordinat",
      value: { lat: usulan?.lat, lng: usulan?.lng },
      type: "map",
    },
    {
      title: "Daya Tampung",
      value: `${usulan?.dayaTampung?.toLocaleString()} Unit`,
    },
    ...(Number(usulan.type) === 7
      ? [
          {
            title: "Proporsi Jumlah Rumah",
            value: (
              <Table>
                <tbody>
                  <tr>
                    <td>Jumlah Rumah Umum</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahUmum.toLocaleString()} Unit
                    </td>
                    <td>{usulan?.proporsiJml?.presentaseRumahUmum || 0} %</td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Menengah</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahMenengah.toLocaleString()}{" "}
                      Unit
                    </td>
                    <td>
                      {usulan?.proporsiJml?.presentaseRumahMenengah || 0} %
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Mewah</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahMewah.toLocaleString()} Unit
                    </td>
                    <td>{usulan?.proporsiJml?.presentaseRumahMewah || 0} %</td>
                  </tr>
                </tbody>
              </Table>
            ),
            type: "spanTitle",
          },
          {
            title: "Jumlah Rumah Terbangun",
            value: (
              <Table>
                <tbody>
                  <tr>
                    <td>Jumlah Rumah Umum</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahUmum?.toLocaleString()}{" "}
                      Unit
                    </td>
                    <td>
                      {usulan?.rumahTerbangun?.presentaseRumahUmum || 0} %
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Menengah</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahMenengah?.toLocaleString()}{" "}
                      Unit
                    </td>
                    <td>
                      {usulan?.rumahTerbangun?.presentaseRumahMenengah || 0} %
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Mewah</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahMewah?.toLocaleString()}{" "}
                      Unit
                    </td>
                    <td>
                      {usulan?.rumahTerbangun?.presentaseRumahMewah || 0} %
                    </td>
                  </tr>
                </tbody>
              </Table>
            ),
            type: "spanTitle",
          },
        ]
      : []),
    {
      title: "Jumlah Usulan",
      value: `${usulan?.jumlahUsulan?.toLocaleString()} Unit`,
    },
    {
      title: "Bentuk Bantuan",
      value: (
        <ul>
          {Array.isArray(usulan?.bentukBantuan) &&
            usulan?.bentukBantuan.map((val) => (
              <li key={val?.prioritas}>
                Prioritas {val?.prioritas} - {val?.bentukBantuan}
              </li>
            ))}
        </ul>
      ),
    },
    {
      title: "Dokumen SBU",
      // value: usulan.dokumenSbu,
      // type: "document",
      value: (
        <>
          {usulan?.dokumenSbu && (
            <>
              {Array.isArray(usulan.dokumenSbu) ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {usulan?.dokumenSbu?.map(
                    ({ isS3, s3url, path, filename }, index) => (
                      <li key={`dokumen-sbu-${index}`}>
                        <LinkS3 href={isS3 ? s3url : path}>{filename}</LinkS3>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <>
                  <LinkS3
                    href={
                      usulan.dokumenSbu.isS3
                        ? usulan.dokumenSbu.s3url
                        : usulan.dokumenSbu.path
                    }
                  >
                    {usulan.dokumenSbu.filename}
                  </LinkS3>
                </>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  const listTableDataPengusulPemda = [
    { title: "Nama PIC", value: usulan?.picPengusul },
    { title: "Jabatan PIC", value: usulan?.jabatanPic },
    { title: "Email PIC", value: usulan?.email },
    { title: "No. HP PIC", value: usulan?.telponPengusul },
    { title: "Instansi", value: usulan?.instansi },
    { title: "Alamat Instansi", value: usulan?.alamatInstansi },
  ];

  const listTableDataPerumahanPemda = [
    { title: "Nama Perumahan", value: usulan?.namaPerumahan },
    Number(usulan?.type) === 5
      ? {
          title: "Nomor Surat Keputusan Kepala Daerah",
          value: usulan?.noSuratKeputusanDaerah,
        }
      : {
          title: "Nama Kelompok MBR",
          value: usulan?.namaKelompokMbr,
        },
    { title: "Alamat Perumahan", value: usulan?.alamatLokasi },
    { title: "Provinsi", value: usulan?.Provinsi?.nama },
    { title: "Kabupaten", value: usulan?.City?.nama },
    {
      title: "Koordinat",
      value: usulan?.UsulanLokasis,
      type: "map-multiple-marker",
    },
    ...(usulan?.luasanDelinasi
      ? [
          {
            title: "Luas Delinasi",
            value: `${usulan?.luasanDelinasi?.toLocaleString()} Ha`,
          },
        ]
      : []),
    {
      title: "Daya Tampung",
      value: `${usulan?.dayaTampung?.toLocaleString()} Unit`,
    },
    ...(Number(usulan?.type) === 5
      ? [
          {
            title: "Proporsi Jumlah Rumah",
            value: (
              <Table>
                <tbody>
                  <tr>
                    <td>Jumlah Rumah Umum</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahUmum?.toLocaleString()} Unit
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Menengah</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahMenengah?.toLocaleString()}{" "}
                      Unit
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Mewah</td>
                    <td>
                      {usulan?.proporsiJml?.jmlRumahMewah?.toLocaleString()}{" "}
                      Unit
                    </td>
                  </tr>
                </tbody>
              </Table>
            ),
            type: "spanTitle",
          },
          {
            title: "Jumlah Rumah Terbangun",
            value: (
              <Table>
                <tbody>
                  <tr>
                    <td>Jumlah Rumah Umum</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahUmum?.toLocaleString()}{" "}
                      Unit
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Menengah</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahMenengah?.toLocaleString()}{" "}
                      Unit
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Rumah Mewah</td>
                    <td>
                      {usulan?.rumahTerbangun?.jmlRumahMewah?.toLocaleString()}{" "}
                      Unit
                    </td>
                  </tr>
                </tbody>
              </Table>
            ),
            type: "spanTitle",
          },
        ]
      : []),
    {
      title: "Jumlah Usulan",
      value: `${usulan?.jumlahUsulan?.toLocaleString()} Unit`,
    },
    {
      title: "Bentuk Bantuan",
      value: (
        <ul>
          {Array.isArray(usulan?.bentukBantuan) &&
            usulan?.bentukBantuan.map((val) => (
              <li key={val?.prioritas}>
                Prioritas {val?.prioritas} - {val?.bentukBantuan}
                {val?.besertaDrainase !== undefined
                  ? ` (Beserta Drainase: ${
                      val?.besertaDrainase ? "Ya" : "Tidak"
                    })`
                  : ""}
              </li>
            ))}
        </ul>
      ),
    },
    // {
    //   title: "Dokumen SBU",
    //   value: (
    //     <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
    //       {usulan?.dokumenSbu?.map(({ isS3, s3url, path, filename }, index) => (
    //         <li key={`dokumen-sbu-${index}`}>
    //           <LinkS3 href={isS3 ? s3url : path}>{filename}</LinkS3>
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    ...(!!usulan?.dimensiJalan
      ? [
          {
            title: "Dimensi Jalan Usulan",
            value: (
              <ul>
                <li>
                  Panjang : {usulan?.dimensiJalan?.panjang?.toLocaleString()}{" "}
                  Meter
                </li>
                <li>
                  Lebar : {usulan?.dimensiJalan?.lebar?.toLocaleString()} Meter
                </li>
              </ul>
            ),
          },
        ]
      : []),
    ...(!!usulan?.statusJalan
      ? [
          {
            title: "Status Jalan",
            value: (
              <span>
                {usulan?.statusJalan}{" "}
                {!!usulan?.detailStatus ? `(${usulan?.detailStatus})` : ""}
              </span>
            ),
          },
        ]
      : []),
  ];
  return (
    <>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="row-head-first">Nomor Usulan</td>
            <td>{usulan.noUsulan || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Nomor KONREG</td>
            <td>{usulan.siproId || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Tipe Usulan</td>
            <td>
              {_.find(TIPE_USULAN, (o) => o.direktorat === usulan.DirektoratId)
                .name || "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Jenis Usulan</td>
            <td>
              {_.find(
                JENIS_DATA_USULAN.non_ruk,
                (o) => o.value === Number(usulan.jenisData)
              )?.label || "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Jenis Perumahan</td>
            <td>
              {_.find(
                JENIS_DATA_USULAN.ruk,
                (o) => o.value === Number(usulan.type)
              )?.label || "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Nomor Surat</td>
            <td>{usulan.noSurat || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Tanggal Surat</td>
            <td>
              {usulan.tglSurat
                ? moment(usulan.tglSurat).format("DD/MM/YYYY")
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Tahun Anggaran</td>
            <td>{usulan.tahunBantuanPsu || "-"}</td>
          </tr>
        </tbody>
      </Table>
      <br />
      <h5>Data Pengusul</h5>
      <hr style={{ marginBottom: 0 }}></hr>
      {isPemda ? (
        <>
          <Table size="sm" responsive>
            <tbody>
              {listTableDataPengusulPemda.map((item) => {
                return (
                  <tr key={item.title}>
                    <td className="row-head">{item.title}</td>
                    <td>{item.value || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <br />
          <h5>Data Perumahan</h5>
          <hr style={{ marginBottom: 0 }}></hr>
          <Table size="sm" responsive>
            <tbody>
              {listTableDataPerumahanPemda.map((item) => {
                if (item.type === "map-multiple-marker") {
                  return (
                    <tr key={item.title}>
                      <td colSpan={3}>
                        <p className="row-head" style={{ marginBottom: "4px" }}>
                          {item.title}
                        </p>
                        {item?.value?.length > 0 ? (
                          <>
                            <LeafletMapViewMultipleMarker
                              coordinates={
                                item.value?.map((lokasi) => ({
                                  id: lokasi.id,
                                  latitude: lokasi?.lat,
                                  longitude: lokasi?.lng,
                                  displayText: (
                                    <div>
                                      Desa: {lokasi?.Desa?.nama} <br />
                                      Kecamatan: {lokasi?.Kecamatan?.nama}
                                    </div>
                                  ),
                                })) ?? []
                              }
                            />
                            <div
                              style={{
                                maxheight: 400,
                                overflow: "auto",
                                marginTop: "1rem",
                                marginBottom: "1rem",
                              }}
                            >
                              <Table size="sm">
                                <thead>
                                  <tr>
                                    <th style={{ position: "sticky", top: 0 }}>
                                      Latitude
                                    </th>
                                    <th style={{ position: "sticky", top: 0 }}>
                                      Longitude
                                    </th>
                                    <th style={{ position: "sticky", top: 0 }}>
                                      Kecamatan
                                    </th>
                                    <th style={{ position: "sticky", top: 0 }}>
                                      Desa
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item?.value?.map((lokasi) => {
                                    return (
                                      <tr key={lokasi?.id}>
                                        <td>{lokasi?.lat || "-"}</td>
                                        <td>{lokasi?.lng || "-"}</td>
                                        <td>
                                          {lokasi?.Kecamatan?.nama || "-"}
                                        </td>
                                        <td>{lokasi?.Desa?.nama || "-"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  );
                }
                if (item.type === "spanTitle") {
                  return (
                    <React.Fragment key={item.title}>
                      <tr>
                        <td className="row-head" colSpan={3}>
                          {item.title}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>{item.value}</td>
                      </tr>
                    </React.Fragment>
                  );
                }
                return (
                  <tr key={item.title}>
                    <td className="row-head">{item.title}</td>
                    <td>{item.value || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <>
          <Table size="sm" responsive>
            <tbody>
              {listTableDataPengusulPengembang.map((item) => {
                return (
                  <tr key={item.title}>
                    <td className="row-head">{item.title}</td>
                    <td>{item.value || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <br />
          <h5>Data Perumahan</h5>
          <hr style={{ marginBottom: 0 }}></hr>
          <Table size="sm" responsive>
            <tbody>
              {listTableDataPerumahanPengembang.map((item) => {
                if (item.type === "spanTitle") {
                  return (
                    <React.Fragment key={item.title}>
                      <tr>
                        <td className="row-head" colSpan={3}>
                          {item.title}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>{item.value}</td>
                      </tr>
                    </React.Fragment>
                  );
                }
                if (item.type === "map") {
                  return (
                    <tr key={item.title}>
                      <td colSpan={3}>
                        <p className="row-head" style={{ marginBottom: "4px" }}>
                          {item.title}
                        </p>
                        <LeafletMaps
                          latitude={parseFloat(item.value.lat)}
                          longitude={parseFloat(item.value.lng)}
                        />
                        <Table className="mb-1">
                          <tr>
                            <th>Latitude</th>
                            <th>Longitude</th>
                          </tr>
                          <tr>
                            <td>{item.value.lat}</td>
                            <td>{item.value.lng}</td>
                          </tr>
                        </Table>
                      </td>
                    </tr>
                  );
                }
                if (item.type === "document") {
                  return Array.isArray(item.value) ? (
                    <tr key={item.title}>
                      <th>{item.title}</th>
                      {item.value.map((dokumen, key) => (
                        <React.Fragment key={key}>
                          <td>
                            <LinkS3
                              rel="noreferrer"
                              href={dokumen.isS3 ? dokumen.s3url : dokumen.path}
                            >
                              <Button size="sm">
                                Download Dokumen ({key + 1})
                              </Button>
                            </LinkS3>
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ) : (
                    <tr key={item.title}>
                      <th>{item.title}</th>
                      <td>
                        <LinkS3
                          rel="noreferrer"
                          href={
                            item.value.isS3
                              ? item.value?.s3url
                              : item.value?.path
                          }
                        >
                          <Button size="sm">Download Dokumen</Button>
                        </LinkS3>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={item.title}>
                    <td className="row-head">{item.title}</td>
                    <td>{item.value || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <VerminDetail usulan={usulan} />
    </>
  );
};

export default RukDetail;
