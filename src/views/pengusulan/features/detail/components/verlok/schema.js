// ** Third Party Components
import * as yup from "yup";

export const formVerlokValidationSchema = () => {
  return yup.object().shape({
    status: yup.string(),
  });
};
