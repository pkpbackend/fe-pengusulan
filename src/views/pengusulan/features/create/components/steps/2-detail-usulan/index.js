// ** React Imports
import { Fragment, useState } from "react";
import { Badge, Button } from "reactstrap";

// ** Custom Components
import FormRusun from "./forms/rusun";
import FormRusus from "./forms/rusus";
import FormRuk from "./forms/ruk";

import FormSwa from "./forms/ruswa";
import DataEntryDeadline from "../../DataEntryDeadline";
import { useNavigate } from "react-router";
import { ArrowLeft } from "react-feather";

const DetailUsulan = (props) => {
  const [allowUpdate, setAllowUpdate] = useState(true);
  const navigate = useNavigate();

  return (
    <Fragment>
      <div className="content-header">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Detail Usulan</h5>
          {Number(props?.form?.formData?.jenisUsulan?.value) < 4 && (
            <>
              {Number(props?.form?.formData?.jenisData?.value) > 1 && (
                <Badge color="warning" pill style={{ marginLeft: 7 }}>
                  D
                </Badge>
              )}
            </>
          )}
          {Number(props?.form?.formData?.jenisUsulan?.value) === 4 && (
            <>
              {props?.form?.formData?.jenisPengusul === "pemda" && (
                <Badge color="warning" pill style={{ marginLeft: 7 }}>
                  Pemda
                </Badge>
              )}
              {props?.form?.formData?.jenisPengusul === "pengembang" && (
                <Badge color="warning" pill style={{ marginLeft: 7 }}>
                  Pengembang
                </Badge>
              )}
              {Number(props?.form?.formData?.jenisData?.value) === 5 && (
                <Badge color="warning" pill style={{ marginLeft: 7 }}>
                  PSB
                </Badge>
              )}
              {Number(props?.form?.formData?.jenisData?.value) === 6 && (
                <Badge color="warning" pill style={{ marginLeft: 7 }}>
                  PSSB
                </Badge>
              )}
            </>
          )}
        </div>
        <small className="text-muted">Masukan data detail usulan.</small>
      </div>
      <hr />
      {props?.form?.formData?.id ? (
        <>
          <DataEntryDeadline
            jenisUsulan={Number(props?.form?.formData?.jenisUsulan?.value)}
            onIsValidChange={(value) => {
              setAllowUpdate(value);
            }}
          />
          {!allowUpdate ? (
            <Button
              color="primary"
              outline
              onClick={() =>
                navigate(`/pengusulan/${props?.form?.formData?.id}`)
              }
            >
              <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
              <span className="align-middle d-sm-inline-block d-none">
                Kembali
              </span>
            </Button>
          ) : null}
          <hr />
        </>
      ) : null}

      {allowUpdate ? (
        <>
          {Number(props?.form?.formData?.jenisUsulan?.value) === 1 && (
            <FormRusun {...props} />
          )}
          {Number(props?.form?.formData?.jenisUsulan?.value) === 2 && (
            <FormRusus {...props} />
          )}
          {Number(props?.form?.formData?.jenisUsulan?.value) === 3 && (
            <FormSwa {...props} />
          )}
          {Number(props?.form?.formData?.jenisUsulan?.value) === 4 && (
            <FormRuk {...props} />
          )}
        </>
      ) : null}
    </Fragment>
  );
};

export default DetailUsulan;
