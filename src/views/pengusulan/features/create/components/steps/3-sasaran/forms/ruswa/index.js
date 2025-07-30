import FormDirektif from "./FormDirektif";
import FormReguler from "./FormReguler";

const FormRusus = (props) => {
  const { formData } = props.form;
console.log(formData.jenisData?.value);
  if (
    Number(formData.jenisData?.value) === 1 ||
    Number(formData.jenisData?.value) === 5
  ) {
    return <FormReguler {...props} />;
  }

  return <FormDirektif {...props} />;
};

export default FormRusus;
