// ** React Imports
import { Fragment, useEffect } from "react";

// ** Utils
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { formVertekValidationSchema } from "./schema";

import sweetalert from "@src/utility/sweetalert";
import "@styles/react/libs/react-select/_react-select.scss";

import { Download } from "react-feather";
import LinkS3 from "../../../../../../components/LinkS3";
import { useUpdateStatusVertekMutation } from "../../../../domains";

const defaultValues = {
  status: "",
  keterangan: "",
};

const VertekValidationModal = (props) => {
  const { isOpen, onClose, dataVertek } = props;

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(formVertekValidationSchema()),
  });

  useEffect(() => {
    if (dataVertek) {
      reset({
        status: dataVertek.status !== null ? String(dataVertek.status) : "",
        keterangan: dataVertek.keterangan || "",
      });
    }
  }, [dataVertek, reset]);

  // query
  const [validasiVertek] = useUpdateStatusVertekMutation();

  const onSubmit = async (values) => {
    try {
      await validasiVertek({
        id:
          dataVertek.type === "usulan"
            ? dataVertek?.UsulanId
            : dataVertek?.SasaranId,
        SasaranId: dataVertek?.SasaranId,
        UsulanId: dataVertek?.UsulanId,
        status: values.status,
        keterangan: values?.keterangan || "",
        type: dataVertek.type,
        fileVertek: values.fileVertek,
      }).unwrap();
      sweetalert
        .fire("Sukses", "Validasi vertek berhasil...", "success")
        .then(() => {
          onClose();
        });
    } catch (error) {
      sweetalert.fire("Gagal", "Validasi vertek gagal...", "error");
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={() => onClose()}
        className={`modal-dialog-centered modal-lg`}
        backdrop={isSubmitting ? "static" : true}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={() => onClose()}>Validasi Vertek</ModalHeader>
          <ModalBody>
            <Row className="gy-1">
              <Col md="12">
                <Controller
                  id="status"
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="d-flex gx-4" style={{ gap: "2rem" }}>
                      <FormGroup check>
                        <Label>
                          <Input
                            type="radio"
                            value="1"
                            checked={value === "1"}
                            onChange={onChange}
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                          />
                          Tidak Layak
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label>
                          <Input
                            type="radio"
                            value="3"
                            checked={value === "3"}
                            onChange={onChange}
                            disabled={isSubmitting}
                          />
                          Belum Ditentukan
                        </Label>
                      </FormGroup>
                    </div>
                  )}
                />
              </Col>
              <Col md={12}>
                <Controller
                  name="fileVertek"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <div>
                        <Label for="documentVertek">Dokumen Vertek</Label>
                        <Input
                          id="documentVertek"
                          invalid={errors.fileVertek}
                          onChange={(event) => {
                            onChange(event.target.files[0]);
                          }}
                          type="file"
                          disabled={isSubmitting}
                        />
                        {errors.fileVertek && (
                          <FormFeedback>
                            {errors.fileVertek.message}
                          </FormFeedback>
                        )}
                      </div>
                    );
                  }}
                />
                {dataVertek.fileVertek ? (
                  <div>
                    <LinkS3
                      rel="noopener noreferrer"
                      href={dataVertek.fileVertek}
                      model={"Vertek"}
                      className="btn btn-link btn-sm justify-content-start ps-0"
                    >
                      <Download size={16} /> Lihat Dokumen
                    </LinkS3>
                  </div>
                ) : null}
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
                        rows={5}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} outline disabled={isSubmitting}>
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

export default VertekValidationModal;
