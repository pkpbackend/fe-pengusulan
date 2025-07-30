// ** React Imports
import { Fragment } from "react"
import { Badge } from "reactstrap"

// ** Custom Components
import FormRusun from "./forms/rusun"
import FormRusus from "./forms/rusus"
import FormRuk from "./forms/ruk"
import FormRuswa from "./forms/ruswa"

const SasaranUsulan = (props) => {
  return (
    <Fragment>
      <div className="content-header">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Sasaran/Lokasi</h5>
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
        <small className="text-muted">
          Tentukan sasaran dan lokasi bantuan usulan.
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
  )
}

export default SasaranUsulan
