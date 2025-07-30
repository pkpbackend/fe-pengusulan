import { Table } from "reactstrap"

const VerminDetail = (props) => {
  const { usulan } = props

  return (
    <>
      <br></br>
      <h5>Vermin</h5>
      <hr></hr>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="row-head-first">Status Vermin</td>
            {usulan?.statusVermin !== null ? (
              <>
                {Number(usulan?.statusVermin) === 1 ? (
                  <td>Lengkap</td>
                ) : (
                  <td>Tidak Lengkap</td>
                )}
              </>
            ) : (
              <td>Belum Ditentukan</td>
            )}
          </tr>
          {Number(usulan?.statusVermin) === 1 && (
            <>
              <tr>
                <td className="row-head">KRO</td>
                <td>{usulan?.ProOutput?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">RO</td>
                <td>{usulan?.ProSubOutput?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Uraian</td>
                <td>{usulan?.uraian || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Anggaran</td>
                <td>{Number(usulan?.anggaran || 0).toLocaleString() || "-"}</td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default VerminDetail
