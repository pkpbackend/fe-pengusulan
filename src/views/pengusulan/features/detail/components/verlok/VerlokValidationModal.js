// ** React Imports
import { Fragment, useEffect } from "react";

// ** Utils
import { yupResolver } from "@hookform/resolvers/yup";
import { isObjEmpty } from "@utils/Utils";
import { Controller, useForm } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Col,
  Form,
  Modal,
  FormGroup,
  Input,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { formVerlokValidationSchema } from "./schema";

import "@styles/react/libs/react-select/_react-select.scss";

import { useUpdateStatusVerlokMutation } from "../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const defaultValues = {
  status: "",
  keterangan: "",
};

const VerlokValidationModal = (props) => {
  const { isOpen, onClose, data } = props;

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(formVerlokValidationSchema()),
  });

  useEffect(() => {
    if (data) {
      reset({
        status: data.status !== null ? String(data.status) : "",
        keterangan: data.keterangan || "",
      });
    }
  }, [data, reset]);

  // query
  const [validasiVerlok] = useUpdateStatusVerlokMutation();

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      try {
        await validasiVerlok({
          UsulanId: data?.UsulanId,
          status: values.status || null,
          keterangan: values?.keterangan || "",
        }).unwrap();
        sweetalert
          .fire("Sukses", "Validasi verlok berhasil...", "success")
          .then(() => {
            onClose();
          });
      } catch (error) {
        sweetalert.fire("Gagal", "Validasi verlok gagal...", "error");
      }
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={() => onClose()}
        className={`modal-dialog-centered modal-lg`}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={() => onClose()}>Validasi Verlok</ModalHeader>
          <ModalBody>
            <Row className="gy-1">
              <Col md="12">
                <Controller
                  id="status"
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Label for="status">Status</Label>
                      <div className="d-flex" style={{ gap: "2rem" }}>
                        <FormGroup check>
                          <Label>
                            <Input
                              type="radio"
                              value="1"
                              checked={value === "1"}
                              onChange={onChange}
                            />
                            Layak
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label>
                            <Input
                              type="radio"
                              value="0"
                              checked={value === "0"}
                              onChange={onChange}
                            />
                            Tidak Layak
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label>
                            <Input
                              type="radio"
                              value=""
                              checked={value === ""}
                              onChange={onChange}
                            />
                            Belum Ditentukan
                          </Label>
                        </FormGroup>
                      </div>
                    </>
                  )}
                />
              </Col>
              <Col md="12">
                <Controller
                  name="keterangan"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label for="keterangan">Keterangan</Label>
                      <Input
                        id="keterangan"
                        invalid={errors.keterangan}
                        {...field}
                        type="textarea"
                        rows={3}
                      />
                    </div>
                  )}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => onClose(false)}
              outline
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : null} Validasi
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default VerlokValidationModal;
