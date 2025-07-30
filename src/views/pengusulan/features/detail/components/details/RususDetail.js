// ** Custom Components
import {
  TIPE_USULAN,
  JENIS_DATA_USULAN,
} from "../../../../../../constants/usulan";

// ** Third Party Components
import { Table } from "reactstrap";
import _ from "lodash";
import moment from "moment";

import "../../detail.scss";
import VerminDetail from "./shared/VerminDetail";

const RususDetail = (props) => {
  const { usulan } = props;
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
            <td className="row-head-first">Tipe Usulan</td>
            <td>
              {_.find(TIPE_USULAN, (o) => o.direktorat === usulan.DirektoratId)
                .name || "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Jenis Pengusulan</td>
            <td>
              {_.find(
                JENIS_DATA_USULAN.non_ruk,
                (o) => o.value === Number(usulan.jenisData)
              )?.label || "-"}
            </td>
          </tr>
        </tbody>
      </Table>
      <br></br>
      <h5>Data Pengusul</h5>
      <hr className="mb-0"></hr>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="row-head-first">NIK PIC</td>
            <td>{usulan.nik || "-"}</td>
          </tr>
          <tr>
            <td className="row-head-first">Nama PIC</td>
            <td>{usulan.picPengusul || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Jabatan PIC</td>
            <td>{usulan.jabatanPic || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Email PIC</td>
            <td>{usulan.email || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">No. Telepon PIC</td>
            <td>{usulan.telponPengusul || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Instansi/Lembaga</td>
            <td>{usulan.instansi || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Alamat Instansi/Lembaga</td>
            <td>{usulan.alamatInstansi || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">No. Surat Permohonan</td>
            <td>{usulan.noSurat || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Tanggal Surat Permohonan</td>
            <td>
              {usulan.tglSurat
                ? moment(usulan.tglSurat).format("DD-MM-YYYY")
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Tanggal Anggaran</td>
            <td>{usulan.tahunProposal}</td>
          </tr>
        </tbody>
      </Table>
      <br></br>
      <h5>Sasaran</h5>
      <hr className="mb-0"></hr>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="row-head-first">Penerima Manfaat</td>
            <td>{usulan.PenerimaManfaat?.tipe || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Jumlah Unit</td>
            <td>
              <strong>
                {Number(usulan.jumlahUnit || 0).toLocaleString() || "-"}
              </strong>
            </td>
          </tr>
          <tr>
            <td className="row-head">Provinsi</td>
            <td>{usulan.Provinsi?.nama || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Kabupaten</td>
            <td>{usulan.City?.nama || "-"}</td>
          </tr>
        </tbody>
      </Table>
      <VerminDetail usulan={usulan} />
    </>
  );
};

export default RususDetail;
