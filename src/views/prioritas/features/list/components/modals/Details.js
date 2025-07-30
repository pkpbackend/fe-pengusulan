// ** React Imports
import { Fragment } from "react"
import _ from "lodash"
import moment from "moment"

// ** Reactstrap Imports
import {
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Row,
  Col,
  Table,
  Form,
} from "reactstrap"
import {
  JENIS_DATA_USULAN,
  TIPE_USULAN,
} from "../../../../../../constants/usulan"

// ** Query
import {
  useDetailPrioritasQuery
} from "../../../../domains/prioritas"

const Details = (props) => {
  const { toggle, setToggle } = props
  const { data } = toggle

  // ** query
  const { data: resData, isFetching } = useDetailPrioritasQuery(data.id)
  const usulan = resData || null

  return (
    <Fragment>
      <Modal
        isOpen={toggle.open}
        toggle={() => setToggle({ open: false })}
        className={`modal-dialog-centered modal-xl`}
      >
        <Form>
          <ModalHeader toggle={() => setToggle({ open: false })}>
            Detail Usulan Prioritas
          </ModalHeader>
          <ModalBody>
            {isFetching ? (
              <div
                className="p-4"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="primary" />
              </div>
            ) : (
              <Row>
                {usulan && (
                  <Col className="mb-1">
                    <h5>Data Usulan</h5>
                    <hr></hr>
                    <Table size="sm" responsive>
                      <tbody>
                        <tr>
                          <td width="300" className="row-head-first">No Usulan</td>
                          <td>{usulan.noUsulan || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Tipe Usulan</td>
                          <td>
                            {_.find(TIPE_USULAN, (o) => o.direktorat === usulan.DirektoratId)?.name || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="row-head">Jenis Usulan</td>
                          {usulan.DirektoratId === 4 && (
                            <td>
                              {usulan.jenisData
                                ? _.find(JENIS_DATA_USULAN.ruk, {
                                  value: Number(usulan.jenisData)
                                }).label
                                : "-"}
                            </td>
                          )}
                          {usulan.DirektoratId !== 4 && (
                            <td>
                              {usulan.jenisData
                                ? _.find(JENIS_DATA_USULAN.non_ruk, {
                                  value: Number(usulan.jenisData)
                                }).label
                                : "-"}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </Table>

                    <h5>Detail</h5>
                    <hr></hr>
                    <Table size="sm" responsive>
                      <tbody>
                        <tr>
                          <td  width="300" className="row-head-first">Nama PIC Pengusul</td>
                          <td>{usulan?.picPengusul || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Jabatan PIC Pengusul</td>
                          <td>{usulan?.jabatanPic || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Email PIC Pengusul</td>
                          <td>{usulan?.email || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">No. HP PIC Pengusul</td>
                          <td>{usulan?.telponPengusul || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">No. Telepon PIC Pengusul</td>
                          <td>{usulan?.telponPengusul || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">No. Surat Permohonan</td>
                          <td>{usulan?.noSurat || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Tanggal Surat Permohonan</td>
                          <td>
                            {usulan?.tglSurat
                              ? moment(usulan?.tglSurat).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="row-head">Untuk Diajukan Ke Tahun Usulan</td>
                          <td>{usulan?.tahunProposal || "-"}</td>
                        </tr>
                      </tbody>
                    </Table>

                    <h5>Sasaran</h5>
                    <hr></hr>
                    <Table size="sm" responsive>
                      <tbody>
                        <tr>
                          <td width="300" className="row-head-first">Penerima Manfaat</td>
                          <td>{usulan?.PenerimaManfaat?.tipe || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Jumlah Unit</td>
                          <td>{Number(usulan?.jumlahUnit || 0).toLocaleString() || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Jumlah Tower</td>
                          <td>{Number(usulan?.jumlahTb || 0).toLocaleString() || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Provinsi</td>
                          <td>{usulan?.Provinsi?.nama || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Kabupaten</td>
                          <td>{usulan?.City?.nama || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Kecamatan</td>
                          <td>{JSON.parse(usulan?.Kecamatan)?.nama || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Desa</td>
                          <td>{usulan?.Desa?.nama || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Latitude</td>
                          <td>{usulan?.lat || "-"}</td>
                        </tr>
                        <tr>
                          <td className="row-head">Longitude</td>
                          <td>{usulan?.lng || "-"}</td>
                        </tr>
                      </tbody>
                    </Table>

                    <h5>Vermin</h5>
                    <hr></hr>
                    <Table size="sm" responsive>
                      <tbody>
                        <tr>
                          <td width="300" className="row-head-first">Status Vermin</td>
                          {usulan.statusVermin !== null ? (
                            <>
                              {Number(usulan.statusVermin) === 1 ? (
                                <td>Lengkap</td>
                              ) : (
                                <td>Tidak Lengkap</td>
                              )}
                            </>
                          ) : (
                            <td>Belum Ditentukan</td>
                          )}
                        </tr>
                        {Number(usulan.statusVermin) === 1 && (
                          <>
                            <tr>
                              <td className="row-head">KRO</td>
                              <td>{usulan.ProOutput?.nama || "-"}</td>
                            </tr>
                            <tr>
                              <td className="row-head">RO</td>
                              <td>{usulan.ProSubOutput?.nama || "-"}</td>
                            </tr>
                            <tr>
                              <td className="row-head">Uraian</td>
                              <td>{usulan.uraian || "-"}</td>
                            </tr>
                            <tr>
                              <td className="row-head">Anggaran</td>
                              <td>{Number(usulan.anggaran || 0).toLocaleString() || "-"}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                )}
              </Row>
            )}
          </ModalBody>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default Details
