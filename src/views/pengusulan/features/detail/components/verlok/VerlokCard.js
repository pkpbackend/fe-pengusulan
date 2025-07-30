import { useState } from "react";

// ** hooks
// ** Third Party Components
import classnames from "classnames";
import { Check } from "react-feather";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Label,
  UncontrolledAccordion,
} from "reactstrap";
import VerlokValidationModal from "./VerlokValidationModal";
const VerlokAlert = ({ status }) => {
  let displayText = "Belum Verifikasi";
  let alertColor = "secondary";
  if (status === 1) {
    displayText = "Verlok Lengkap";
    alertColor = "primary";
  }
  if (status === 0) {
    displayText = "Verlok Tidak Lengkap";
    alertColor = "danger";
  }
  return (
    <Alert color={alertColor}>
      <div className="alert-body d-flex align-items-center justify-content-center">
        <span className="ms-50 fs-4">{displayText}</span>
      </div>
    </Alert>
  );
};
const VerlokCard = (props) => {
  const { usulan } = props;

  // local state
  const [toggleValidasiVerlok, setToggleValidasiVerlok] = useState(false);

  return (
    <>
      <UncontrolledAccordion
        className="shadow"
        style={{ borderRadius: "0.428rem" }}
        defaultOpen="data-verlok"
      >
        <AccordionItem>
          <AccordionHeader
            targetId="data-verlok"
            className="title-accordion-text"
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "100%", paddingRight: "1rem" }}
            >
              Verifikasi Lokasi
              <div className="d-flex">
                <span
                  className={classnames("btn btn-primary btn-sm", {})}
                  tabIndex={-1}
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setToggleValidasiVerlok(true);
                  }}
                >
                  <Check size={14} /> Validasi Verlok
                </span>
              </div>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="data-verlok">
            {usulan.statusVermin === 1 ? null : (
              <Alert color="warning" style={{ padding: "2rem" }}>
                Verlok belum bisa dilakukan
              </Alert>
            )}
          </AccordionBody>
          {usulan.statusVermin === 1 ? null : (
            <div style={{ padding: "0 1rem 1rem 1rem", marginTop: -12 }}>
              <div className="mt-1">
                <VerlokAlert status={usulan?.statusVertek ?? ""} />
              </div>
              {usulan?.keteranganVertek ? (
                <div className="mt-1">
                  <Label style={{ fontWeight: 600 }}>Keterangan:</Label>
                  <p style={{ marginBottom: 0 }}>
                    {usulan?.keteranganVertek ?? "-"}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </AccordionItem>
      </UncontrolledAccordion>
      {toggleValidasiVerlok === true && (
        <VerlokValidationModal
          isOpen={toggleValidasiVerlok === true}
          onClose={() => setToggleValidasiVerlok(false)}
          data={{
            UsulanId: usulan.id,
            status: usulan.statusVertek,
            keterangan: usulan.keteranganVertek,
          }}
        />
      )}
    </>
  );
};

export default VerlokCard;
