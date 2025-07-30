import React, { Fragment } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import { getUser } from "@utils/LoginHelpers";
import LeafletMapsDraw from "@customcomponents/LeafletMapsDraw";
import AnnouncementWidget from '../../widgets/Announcement/AnnouncementWidget';
import EProfile from './EProfile';

const Informasi = (props) => {
  let user = getUser()?.user;

  return (
    <Fragment>
      {/* {user && user.Role.dashboard == 1 && (
        <Row>
          <Col md="12">
            <Card style={{ borderRadius: 15, padding: 5 }}>
              <CardBody>
                <div className={'d-flex align-items-center justify-content-between'}>
                  <div>
                    <div style={{ fontSize: 16 }}>
                      <b>SIBARU DASHBOARD</b> adalah halaman untuk melihat data statistik untuk
                      Eksekutif Dirjen Perumahan
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      color="primary"
                      size="sm"
                      style={{
                        backgroundColor: '#354777',
                        color: 'white',
                      }}
                      onClick={() => {
                        window.location = DASHBOARD_URL;
                      }}
                    >
                      Menuju DASHBOARD
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )} */}
      {process.env.REACT_APP_BUILD_ENV === "development" && (
        <Row>
          <Col md="12">
            <LeafletMapsDraw />
          </Col>
        </Row>
      )}

      <Row>
        <Col md="12">
          <AnnouncementWidget/>
        </Col>
      </Row>

      <EProfile user={user} />
    </Fragment>
  );
};

export default Informasi;
