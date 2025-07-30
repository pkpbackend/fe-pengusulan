// ** Third Party Components
import { Table, Button } from "reactstrap";

import "../../detail.scss";
import { Link } from "react-router-dom";
import { Eye } from "react-feather";

const InformasiUsulanDetail = (props) => {
  const { data } = props;

  const renderButtonDetailUsulan = () => {
    let { id } = data;

    return (
      <Link to={`/pengusulan/${id}`} target="_blank" rel="noopener noreferrer">
        <Button className="btn-icon" block color="primary" size="sm">
          <Eye size={16} /> Detail
        </Button>
      </Link>
    );
  };

  return (
    <Table size="sm" responsive bordered>
      <tbody>
        <tr className="d-none d-md-table-row">
          <td className="row-head">ID Usulan</td>
          <td>{data?.siproId || "-"}</td>
          <td className="row-head">Detail Usulan</td>
          <td>{renderButtonDetailUsulan()}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">ID Usulan</td>
          <td>{data?.siproId || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Detail Usulan</td>
          <td>{renderButtonDetailUsulan()}</td>
        </tr>
        <tr>
          <td className="row-head">Nomor Usulan</td>
          <td colSpan={3}>{data?.noUsulan || "-"}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default InformasiUsulanDetail;
