import React from 'react'
import { useParams } from 'react-router-dom'
import { 
  Row, 
  Col, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  Spinner, 
} from 'reactstrap'
import Breadcrumbs from "@components/breadcrumbs/custom"
import InformasiPenetapanDetail from './components/details/InformasiPenetapanDetail'
import InformasiUsulanDetail from './components/details/InformasiUsulanDetail'
import { useDetailPenetapanQuery } from "../../domains"

const DetailPenetapan = (props) => {
  let { id } = useParams()

  const {
    data,
    isFetching,
    error,
  } = useDetailPenetapanQuery(id, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <Row>
      <Breadcrumbs
        title="Detail Penetapan"
        data={[
          { title: "Penetapan", link: `/penetapan/list` },
          { title: "Detail Penetapan" },
        ]}
      />

      <Col lg="8" md="12">
        <Card>
          <CardHeader className="bg-darkblue">
            <CardTitle>Informasi Usulan</CardTitle>
          </CardHeader>
          <CardBody>
            {isFetching?(
              <Spinner />
            ):(
              <InformasiUsulanDetail data={data || {}} />
            )}
          </CardBody>
        </Card>
      </Col>

      <Col lg="4" md="12">
        <Card>
          <CardHeader className="bg-darkblue">
            <CardTitle>Informasi Penetapan</CardTitle>
          </CardHeader>
          <CardBody>
            {isFetching?(
              <Spinner />
            ):(
              <InformasiPenetapanDetail data={data || {}} />
            )}
          </CardBody>
        </Card>
      </Col>

    </Row>
  )
}

export default DetailPenetapan
