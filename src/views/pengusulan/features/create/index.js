// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs/custom"

// ** Third Party Components
import { Row, Col } from "reactstrap"
import FormUsulan from "./components/FormUsulan"

const Create = () => {
  return (
    <Fragment>
      <Breadcrumbs title="Tambah Usulan" data={[{ title: "Pengusulan" }]} />
      <Row>
        <Col sm="12">
          <FormUsulan />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Create
