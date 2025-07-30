import { Fragment, useEffect, useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Steps
import JenisUsulan from "./steps/1-jenis-usulan";
import DetailUsulan from "./steps/2-detail-usulan";
import SasaranUsulan from "./steps/3-sasaran";
import ReviewUsulan from "./steps/4-review";
import _ from "lodash";

// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";

const FormUsulan = (props) => {
  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [formData, setFormData] = useState(props.formData || {});

  const steps = [
    {
      id: "jenis",
      title: "Jenis Usulan",
      subtitle: "Pilih Data Jenis Usulan",
      icon: <FileText size={18} />,
      content: (
        <JenisUsulan
          stepper={stepper}
          type="wizard-modern"
          form={{ formData, setFormData }}
        />
      ),
    },
    {
      id: "info",
      title: "Detail Usulan",
      subtitle: "Input Detail Usulan",
      icon: <User size={18} />,
      content: (
        <DetailUsulan
          stepper={stepper}
          type="wizard-modern"
          form={{ formData, setFormData }}
        />
      ),
    },
    {
      id: "sasaran",
      title: "Sasaran/Lokasi",
      subtitle: "Tentukan Sasaran/Lokasi",
      icon: <MapPin size={18} />,
      content: (
        <SasaranUsulan
          stepper={stepper}
          type="wizard-modern"
          form={{ formData, setFormData }}
        />
      ),
    },
    {
      id: "review",
      title: "Review",
      subtitle: "Review Kembali Usulan",
      icon: <Link size={18} />,
      content: (
        <ReviewUsulan
          stepper={stepper}
          type="wizard-modern"
          form={{ formData, setFormData }}
        />
      ),
    },
  ];

  if (props.formData) {
    _.remove(steps, (o) => {
      return o.id === "jenis"
    })
  }

  useEffect(() => {
    ref.current.addEventListener("shown.bs-stepper", function () {
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <Fragment>
      <div className="modern-horizontal-wizard">
        <Wizard
          type="modern-horizontal"
          ref={ref}
          steps={steps}
          instance={(el) => setStepper(el)}
        />
      </div>
    </Fragment>
  );
};

export default FormUsulan;
