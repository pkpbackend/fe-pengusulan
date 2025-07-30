// ** React Imports
import { Fragment, useEffect } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  Input,
  Form,
  FormFeedback,
  FormGroup,
  Spinner,
} from "reactstrap";
import { formVerminValidationSchema } from "./schema";
import Cleave from "cleave.js/react";
import classnames from "classnames";
import Select from "react-select";

import { useKROQuery, useROQuery } from "@globalapi/usulan";

import "@styles/react/libs/react-select/_react-select.scss";

import { useUpdateValidasiVerminUsulanMutation } from "../../../../domains";
import sweetalert from "@src/utility/sweetalert";

const defaultValues = {
  status: "",
  kro: "",
  ro: "",
  uraian: "",
  keterangan: "",
  anggaran: "",
};

const VerminValidationModal = (props) => {
  const { toggle, setToggle, data } = props;

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(formVerminValidationSchema()),
  });

  useEffect(() => {
    if (data) {
      reset({
        status: data.status !== null ? String(data.status) : "",
        kro: data.KroId || "",
        ro: data.RoId || "",
        uraian: data.uraian || "",
        anggaran: data.anggaran || "",
        keterangan: data.keterangan || "",
      });
    }
  }, [data, reset]);

  const status = watch("status");
  const kro = watch("kro");

  const canActionVermin = status === "1";

  // query
  const [validasiVermin] = useUpdateValidasiVerminUsulanMutation();
  const queryKro = useKROQuery(
    {},
    {
      skip: !canActionVermin,
    }
  );
  const queryRo = useROQuery(
    {
      id_output: kro,
    },
    {
      skip: !kro,
    }
  );

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      try {
        await validasiVermin({
          id: data.id,
          UsulanId: data.UsulanId,
          status: values.status ? Number(values.status) : null,
          keterangan: values?.keterangan || "",
          uraian: values?.uraian || "",
          KroId: values.kro ? Number(values.kro) : null,
          RoId: values.ro ? Number(values.ro) : null,
          anggaran: values.anggaran || null,
        }).unwrap();
        sweetalert
          .fire("Sukses", "Validasi vermin berhasil...", "success")
          .then(() => {
            setToggle(false);
          });
      } catch (error) {
        sweetalert.fire("Gagal", "Validasi vermin gagal...", "error");
      }
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={toggle}
        toggle={() => setToggle(false)}
        className={`modal-dialog-centered modal-lg`}
        backdrop={isSubmitting ? "static" : true}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={() => setToggle(false)}>
            Validasi Vermin
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12" className="mb-1">
                <Controller
                  id="status"
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Label for="status">Apakah Dokumen?</Label>
                      <div className="d-flex" style={{ gap: "2rem" }}>
                        <FormGroup check>
                          <Label>
                            <Input
                              type="radio"
                              value="1"
                              checked={value === "1"}
                              onChange={onChange}
                              disabled={isSubmitting}
                            />
                            Sudah Verifikasi
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
                            Tidak Lengkap
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label>
                            <Input
                              type="radio"
                              value=""
                              checked={value === ""}
                              onChange={onChange}
                              disabled={isSubmitting}
                            />
                            Belum Ditentukan
                          </Label>
                        </FormGroup>
                      </div>
                    </>
                  )}
                />
              </Col>
              <Col md="12" className="mb-1">
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
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                />
              </Col>
            </Row>
            {canActionVermin && (
              <Row>
                <Col md="12">
                  <hr></hr>
                </Col>
                <Col md="12" className="mb-1">
                  <Controller
                    id="kro"
                    name="kro"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label for="kro">KRO</Label>
                        <Select
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          placeholder="Silahkan pilih KRO..."
                          className={classnames("react-select", {
                            "is-invalid": errors.kro,
                          })}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.id);
                          }}
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) =>
                            `${option.kode} | ${option.nama}`
                          }
                          value={
                            queryKro?.data?.find((c) => c.id === value) || ""
                          }
                          options={queryKro?.data || []}
                          isLoading={queryKro?.isLoading || false}
                          isDisabled={isSubmitting}
                        />
                        {errors.kro && (
                          <FormFeedback>{errors.kro.message}</FormFeedback>
                        )}
                      </div>
                    )}
                  />
                </Col>
                <Col md="12" className="mb-1">
                  <Controller
                    name="ro"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label for="ro">RO</Label>
                        <Select
                          id="ro"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          placeholder="Silahkan pilih RO..."
                          className={classnames("react-select", {
                            "is-invalid": errors.ro,
                          })}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.id);
                          }}
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) =>
                            `${option.kode} | ${option.nama}`
                          }
                          isDisabled={!kro || isSubmitting}
                          value={
                            queryRo.data?.find((c) => c.id === value) || ""
                          }
                          options={queryRo?.data || []}
                          isLoading={queryRo?.isLoading}
                        />
                        {errors.ro && (
                          <FormFeedback>{errors.ro.message}</FormFeedback>
                        )}
                      </div>
                    )}
                  />
                </Col>
                <Col md="12" className="mb-1">
                  <Controller
                    name="uraian"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label for="uraian">Uraian</Label>
                        <Input
                          id="uraian"
                          invalid={errors.uraian}
                          {...field}
                          type="textarea"
                          rows={5}
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  />
                  {errors.uraian && (
                    <FormFeedback>{errors.uraian.message}</FormFeedback>
                  )}
                </Col>
                <Col md="12" className="mb-1">
                  <Controller
                    id="anggaran"
                    name="anggaran"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label for="anggaran">Anggaran</Label>
                        <Cleave
                          {...field}
                          className={classnames("form-control", {
                            "is-invalid": errors.anggaran,
                          })}
                          placeholder="10,000"
                          options={{
                            numeral: true,
                            numeralThousandsGroupStyle: "thousand",
                          }}
                          onChange={(e) => {
                            field.onChange(e.target.rawValue);
                          }}
                          disabled={isSubmitting}
                        />
                        {errors.anggaran && (
                          <FormFeedback>{errors.anggaran.message}</FormFeedback>
                        )}
                      </div>
                    )}
                  />
                </Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setToggle(false)}
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

export default VerminValidationModal;
