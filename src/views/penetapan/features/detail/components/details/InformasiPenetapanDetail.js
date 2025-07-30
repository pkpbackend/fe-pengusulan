
// ** Third Party Components
import { Table } from "reactstrap"
import moment from "moment"

const InformasiPenetapanDetail = (props) => {
  const { data } = props

  return (
    <>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td style={{ width: 100 }}>No. SK</td>
            <td>
              : {data?.noSk || '-'}
            </td>
          </tr>

          <tr>
            <td>Tanggal</td>
            <td>
              : {data.tanggalSk?moment(data.tanggalSk).format('DD/MM/YYYY'):'-'}
            </td>
          </tr>
          
          <tr>
            <td>Total Unit</td>
            <td>
              : {data?.totalUnit || '-'}
            </td>
          </tr>
          
          <tr>
            <td>Keterangan</td>
            <td>
              : {data?.keterangan || '-'}
            </td>
          </tr>

        </tbody>
      </Table>
    </>
  )
}

export default InformasiPenetapanDetail
