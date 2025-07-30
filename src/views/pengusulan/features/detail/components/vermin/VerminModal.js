// ** React Imports
import { Fragment } from "react";

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
  FormText,
  Spinner,
  InputGroup,
} from "reactstrap";
import {
  useUpdateUsulanDocumentMutation,
  useUploadUsulanDocumentMutation,
} from "../../../../domains/dokumen";
import { File } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LinkS3 from "../../../../../../components/LinkS3";

import { formUploadVermin } from "./schema";
import sweetalert from "@src/utility/sweetalert";
import { useSelector } from "react-redux";

const USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE = "usulan_vermin_status_update";
const USULAN_VERMIN_DOKUMEN_STATUS_UPDATE_ACTION_CODE =
  "usulan_vermin_dokumen_status_update";

const VerminModal = (props) => {
  const acl = useSelector((state) => state.auth.user?.Role?.accessMenu);

  const { toggle, setToggle, canUploadFile = false, canUpdate = false } = props;
  const { document, usulan, verminId } = toggle;
  const documentId = document?.verminDocument?.id;
  // query
  const [updateDokumen] = useUpdateUsulanDocumentMutation();
  const [uploadDokumen] = useUploadUsulanDocumentMutation();

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: documentId,
      lengkap: document?.verminDocument?.lengkap ?? 2,
      keterangan: document?.verminDocument?.keterangan ?? "",
    },
    resolver: yupResolver(formUploadVermin),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        model: "Vermin",
        ModelId: verminId,
        UsulanId: usulan.id,
        MasterDokumenId: document.id,
        keterangan: data.keterangan || null,
        lengkap: data.lengkap === "2" ? null : data.lengkap,
        status: data.status || null,
        file: data.file,
      };
      if (documentId) {
        await updateDokumen({ ...payload, id: documentId }).unwrap();
        sweetalert
          .fire("Sukses", "Update berkas berhasil...", "success")
          .then(() => {
            setToggle({
              open: false,
            });
          });
        return;
      }
      await uploadDokumen(payload).unwrap();

      sweetalert
        .fire("Sukses", "Upload berkas berhasil...", "success")
        .then(() => {
          setToggle({
            open: false,
          });
        });
    } catch (error) {
      sweetalert.fire("Gagal", "Upload berkas gagal...", "error");
    }
  };

  const isValidating =
    acl.includes(USULAN_VERMIN_STATUS_UPDATE_ACTION_CODE) ||
    acl.includes(USULAN_VERMIN_DOKUMEN_STATUS_UPDATE_ACTION_CODE)
      ? true
      : false;

  console.log(document);

  return (
    <Fragment>
      <Modal
        isOpen={toggle.open}
        toggle={() => setToggle({ open: false })}
        className={`modal-dialog-centered modal-lg`}
        backdrop={isSubmitting ? "static" : true}
      >
        {document && (
          <Form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader toggle={() => setToggle({ open: false })}>
              {document?.nama || ""}
            </ModalHeader>
            <ModalBody>
              <Row>
                {isValidating && (
                  <>
                    <Col md="12" className="mb-1">
                      <Controller
                        name="lengkap"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <div>
                              <Label className="form-label" for="lengkap">
                                Apakah Dokumen?
                              </Label>
                              <div className="d-flex" style={{ gap: "2rem" }}>
                                <FormGroup check>
                                  <Label>
                                    <Input
                                      type="radio"
                                      value={1}
                                      checked={Number(value) === 1}
                                      onChange={onChange}
                                      disabled={isSubmitting}
                                    />
                                    Sudah Verifikasi
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label>
                                    Tidak Sesuai
                                    <Input
                                      type="radio"
                                      value={0}
                                      checked={Number(value) === 0}
                                      onChange={onChange}
                                      disabled={isSubmitting}
                                    />
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label>
                                    Belum Ditentukan
                                    <Input
                                      type="radio"
                                      value={2}
                                      checked={Number(value) === 2}
                                      onChange={onChange}
                                      disabled={isSubmitting}
                                    />
                                  </Label>
                                </FormGroup>
                              </div>
                              {errors.lengkap && (
                                <FormFeedback>
                                  {errors.lengkap.message}
                                </FormFeedback>
                              )}
                            </div>
                          );
                        }}
                      />
                    </Col>
                  </>
                )}

                <Col md="12" className="mb-1">
                  <Controller
                    name="file"
                    control={control}
                    render={({ field: { onChange } }) => {
                      return (
                        <div>
                          <Label className="form-label" for="file">
                            File
                          </Label>
                          <Input
                            id="file"
                            invalid={errors.file}
                            onChange={(event) => {
                              onChange(event.target.files[0]);
                            }}
                            type="file"
                            accept={`.${document.typeFile}`}
                            disabled={isSubmitting}
                          />
                          {errors.file && (
                            <FormFeedback>{errors.file.message}</FormFeedback>
                          )}
                          {document.maxSize || document.typeFile ? (
                            <FormText>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  {document.maxSize
                                    ? `Maksimum Ukuran File: ${document.maxSize} MB`
                                    : ""}{" "}
                                </span>
                                <span>
                                  {document.formatDokumen && (
                                    <LinkS3
                                      rel="noreferrer"
                                      href={`public/${document.formatDokumen}`}
                                      model={document.formatDokumen}
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      <File size={8} />
                                      <span style={{ marginLeft: 7 }}>
                                        Lihat Sample Dokumen
                                      </span>
                                    </LinkS3>
                                  )}
                                </span>
                              </div>
                              <span style={{ marginLeft: 10 }}>
                                {document.typeFile
                                  ? `Tipe File: ${document.typeFile}`
                                  : ""}
                              </span>
                            </FormText>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                </Col>

                {document.verminDocument && (
                  <Col md="12" className="mb-1">
                    <LinkS3
                      rel="noreferrer"
                      href={document.verminDocument?.file}
                      model={document.verminDocument?.model}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        textDecoration: "underline",
                      }}
                    >
                      <File size={12} />
                      <span style={{ marginLeft: 7 }}>Lihat Dokumen</span>
                    </LinkS3>
                  </Col>
                )}

                {isValidating && (
                  <Col md="12" className="mb-1">
                    <Controller
                      name="keterangan"
                      control={control}
                      render={({ field }) => {
                        return (
                          <div>
                            <Label className="form-label" for="keterangan">
                              Komentar
                            </Label>
                            <Input
                              id="keterangan"
                              {...field}
                              size="sm"
                              type="textarea"
                              rows="5"
                              placeholder="Masukan komentar..."
                              disabled={isSubmitting}
                            />
                            {errors.keterangan && (
                              <FormFeedback>
                                {errors.keterangan.message}
                              </FormFeedback>
                            )}
                          </div>
                        );
                      }}
                    />
                  </Col>
                )}
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => setToggle({ open: false, document: null })}
                outline
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" /> : null}{" "}
                {isValidating ? "Validasi" : "Simpan"}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Modal>
    </Fragment>
  );
};

export default VerminModal;
