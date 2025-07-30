import { Fragment } from "react";
import { Badge } from "reactstrap";
import FormRuk from "./forms/ruk";
import FormRusun from "./forms/rusun";
import FormRusus from "./forms/rusus";
import FormRuswa from "./forms/ruswa";
import "./review.scss";

const ReviewUsulan = (props) => {
  return (
    <Fragment>
      <div className="content-header">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Review Usulan</h5>
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
            </>
          )}
        </div>
        <small className="text-muted">
          Cek kembali usulan yang anda inputkan.
        </small>
      </div>
      <hr></hr>
      {Number(props?.form?.formData?.jenisUsulan?.value) === 1 && (
        <FormRusun {...props} />
      )}
      {Number(props?.form?.formData?.jenisUsulan?.value) === 2 && (
        <FormRusus {...props} />
      )}
      {Number(props?.form?.formData?.jenisUsulan?.value) === 3 && (
        <FormRuswa {...props} />
      )}
      {Number(props?.form?.formData?.jenisUsulan?.value) === 4 && (
        <FormRuk {...props} />
      )}
    </Fragment>
  );
};

export default ReviewUsulan;
