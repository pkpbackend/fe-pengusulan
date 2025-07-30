import Breadcrumbs from "@components/breadcrumbs/custom";
import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";

import { getUser } from "@utils/LoginHelpers";
import { useDetailKonregPoolQuery } from "../../domains";
import InformasiUsulanDetail from "./components/details/InformasiUsulanDetail";
import KonregDetail from "./components/details/KonregDetail";

const DetailKonregPool = (props) => {
  let { user } = getUser();
  let role = user.Role;
  let { id } = useParams();
  const { data, isFetching, isLoading } = useDetailKonregPoolQuery(id, {
    skip: !id,
  });

  return (
    <Row>
      <Breadcrumbs
        title="Detail Konreg Pool"
        data={[
          { title: "Konreg Pool", link: `/konregpool/list` },
          { title: "Detail Konreg Pool" },
        ]}
      />
      <>
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="bg-darkblue">
              <CardTitle>Informasi Konreg Pool (Data dari SIKONREG)</CardTitle>
            </CardHeader>
            <CardBody>
              {isFetching || isLoading ? (
                <Spinner />
              ) : data ? (
                <KonregDetail data={data} />
              ) : null}
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <CardHeader className="bg-darkblue">
              <CardTitle>Informasi Usulan</CardTitle>
            </CardHeader>
            <CardBody>
              {isFetching || isLoading ? (
                <Spinner />
              ) : data ? (
                <InformasiUsulanDetail data={data} />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </>
    </Row>
  );
};

export default DetailKonregPool;
