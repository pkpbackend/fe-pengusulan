// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom";

// ** Third Party Components
import _ from "lodash";
import { Col, Row } from "reactstrap";

const ListClosed = () => {
  return (
    <Fragment>
      <Breadcrumbs
        title="Fitur Tertutup"
        data={[{ title: "Fitur Tertutup" }]}
      />
      <Row>
        <Col sm="12">
          <h1>Fitur ditutup sementara...</h1>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ListClosed;
