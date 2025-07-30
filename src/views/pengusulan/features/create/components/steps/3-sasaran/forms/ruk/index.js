import FormPemdaSkalaBesar from "./FormPemdaSkalaBesar";
import FormPemdaSelainSkalaBesar from "./FormPemdaSelainSkalaBesar";
import FormPengembang from "./FormPengembang";

const FormRuk = (props) => {
  const { formData } = props.form;

  const isPengembang = formData?.jenisData.value === 7;
  if (!isPengembang) {
    if (formData?.type?.value === 5) {
      return <FormPemdaSkalaBesar {...props} />;
    }
    if (formData?.type?.value === 6) {
      return <FormPemdaSelainSkalaBesar {...props} />;
    }
  } else {
    return <FormPengembang {...props} />;
  }

  console.log("formData", formData);

  return null;
};

export default FormRuk;
