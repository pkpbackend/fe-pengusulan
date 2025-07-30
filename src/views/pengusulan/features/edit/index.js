// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom";
import FormUsulan from "../create/components/FormUsulan";
import { useDetailUsulanQuery } from "../../domains";
import { usulanTransform } from "../../../../utility/Usulan";

// ** Third Party Components
import { Row, Col, Spinner } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import sweetalert from "@src/utility/sweetalert";

const Edit = () => {
  const params = useParams();
  const navigate = useNavigate();
  // ** query
  const { data, isFetching, error } = useDetailUsulanQuery(params.id, {
    refetchOnMountOrArgChange: true,
  });
  const usulan = usulanTransform(data || null);
  if (error?.status === 404) {
    sweetalert
      .fire({
        title: "404 Not Found",
        text: "Data Pengusulan tidak ditemukan",
        icon: "error",
        confirmButtonText: "Kembali",
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/pengusulan/list");
        }
      });
  }

  return (
    <Fragment>
      <Breadcrumbs
        title="Ubah Pengusulan"
        data={[
          { title: "Pengusulan", link: `/pengusulan/list` },
          { title: "Detail Pengusulan", link: `/pengusulan/${params.id}` },
          { title: "Ubah Pengusulan" },
        ]}
      />
      <Row>
        <Col sm="12">
          {isFetching && <Spinner />}
          {!isFetching && usulan && <FormUsulan formData={usulan} />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Edit;
