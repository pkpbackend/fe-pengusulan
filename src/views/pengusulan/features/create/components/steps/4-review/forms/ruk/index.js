import FormPemda from "./FormPemda";
import FormPengembang from "./FormPengembang";

const FormRuk = (props) => {
  const { formData } = props.form;
  const isPengembang = formData?.jenisData?.value === 7;
  if (isPengembang) {
    return <FormPengembang {...props} />;
  }
  return <FormPemda {...props} />;
};

export default FormRuk;
