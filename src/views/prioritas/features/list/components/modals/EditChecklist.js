// ** React Imports
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Check, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Row,
  Col,
  Table,
  Label,
  Input,
  Form,
  Alert,
  FormFeedback,
  // FormText,
} from "reactstrap";
import {
  JENIS_DATA_USULAN,
  TIPE_USULAN,
} from "../../../../../../constants/usulan";
import { File } from "react-feather";

// ** Query
import {
  useDetailPrioritasQuery,
  useUpdatePrioritasMutation,
  useJenisPrioritasQuery,
  useLampiranPrioritasQuery,
  useUpdateLampiranPrioritasMutation,
  useRangkaianProgramPrioritasQuery,
  useLampiranPrioritasDokumenMutation,
} from "../../../../domains/prioritas";

const EditChecklist = (props) => {
  const { toggle, setToggle } = props;
  const [page, setPage] = useState({
    status: 'normal',
    page: 1
  });
  const [dokumen, setDokumen] = useState([]);
  const [dokumenError, setDokumenError] = useState({});
  const { data } = toggle;

  // ** query
  const { data: resData, isFetching } = useDetailPrioritasQuery(data.id);
  const { data: resJenis } = useJenisPrioritasQuery();
  const { data: resLamp } = useLampiranPrioritasQuery();
  const { data: resRangkaianProgram } = useRangkaianProgramPrioritasQuery();
  const [updatePrioritas, result] = useUpdatePrioritasMutation();
  const [updateLampiranPrioritas] = useUpdateLampiranPrioritasMutation();
  const [lampiranPrioritasDokumen] = useLampiranPrioritasDokumenMutation();

  const usulan = resData || null;

  // ** hook form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors},
  } = useForm({
    defaultValues: useMemo(() => {
      let defaultVal = {};
      for (const key of Object.keys(resJenis || {})) {
        defaultVal = {
          ...defaultVal,
          [`crpjns-${resJenis?.[key]?.keyPrioritas}`]: false,
        };
      }
      for (const key of Object.keys(resLamp || {})) {
        defaultVal = {
          ...defaultVal,
          [`lamp-${resLamp?.[key]?.keyPrioritas}`]: false,
        };
      }
      for (const key of Object.keys(resRangkaianProgram || {})) {
        defaultVal = {
          ...defaultVal,
          [`crp-${key}`]: false,
        };
      }

      return defaultVal;
    }, [resRangkaianProgram, resJenis, resLamp]),
    // resolver: yupResolver(formUploadDokumen),
  });

  useEffect(() => {
    (async () => {
      if (resData && resData.prioritasJenis && resData.prioritasJenis.length) {
        const dokumens = [];

        for (const jenisPrioritas of resData.prioritasJenis) {
          const docs = await lampiranPrioritasDokumen({
            id: resData.id,
            jenisPrioritas,
          });

          const files = docs.data;
          if (files && files.length) {
            dokumens[jenisPrioritas] = {
              jenisPrioritas,
              id: resData.id,
              fileURL: files[files.length - 1].url,
            };
          }
        }
        setDokumen(dokumens);
      }
    })();
  }, [resData]);

  useEffect(() => {
    if (resData) {
      let data = {};

      if (resData?.prioritasJenis?.length) {
        for (const key of Object.keys(resJenis || {})) {
          const value = resData?.prioritasJenis?.filter(
            (x) => Number(x) === Number(resJenis?.[key]?.keyPrioritas)
          )?.[0];
          data = {
            ...data,
            [`crpjns-${resJenis?.[key]?.keyPrioritas}`]: Boolean(value),
          };
          handleSwitchChange(resJenis?.[key]?.keyPrioritas, Boolean(value));
        }
      }

      if (resData?.prioritasRangkaianPemrograman?.length) {
        for (const key of Object.keys(resRangkaianProgram || {})) {
          const value = resData?.prioritasRangkaianPemrograman?.filter(
            (x) => Number(x) === Number(key)
          )?.[0];
          data = {
            ...data,
            [`crp-${key}`]: Boolean(value),
          };
        }
      }

      reset({
        ...data,
      });
    }
  }, [resData, resJenis, resRangkaianProgram, resLamp, reset]);

  const onSubmit = async (values) => {
    const resSend = {
      usulanId: data?.id,
      file: data?.file,
      prioritasJenis: [],
      lampiranjenis: [],
      prioritasRangkaianPemrograman: [],
    };

    const resSendFile = {};
    const documentError = {};

    for (const key of Object.keys(values || {})) {
      if (key?.includes("crpjns-") && values?.[key]) {
        const splitData = key?.split("-")?.[1];
        if (splitData) {
          resSend?.prioritasJenis?.push(Number(splitData));
          if (values?.[`lamp-${splitData}`]) {
            resSendFile[Number(splitData)] = values?.[`lamp-${splitData}`];
          } else {
            for (const resJenisKey of Object.keys(resJenis || {})) {
              if (resJenis?.[resJenisKey]?.keyPrioritas === Number(splitData)) {
                if (Number(usulan.jenisData) !== resJenis?.[resJenisKey]?.value) {
                  const file = dokumen?.filter(x=> x?.jenisPrioritas === resJenis?.[resJenisKey]?.keyPrioritas)[0]
                  if (!file) {
                    documentError[`lamp-${splitData}`] = true
                  }
                }
              }
            }
          }
        }
      }

      if (key?.includes("crp-") && values?.[key]) {
        const splitData = key?.split("-")?.[1];
        if (splitData) {
          resSend?.prioritasRangkaianPemrograman?.push(Number(splitData));
        }
      }
    }

    if (page.page < 2) {
      if (page.status !== 'prev') {
        setDokumenError(documentError)
        if (_.isEmpty(documentError)) {
          setPage({
            status: 'next',
            page: 2
          })
        }
      } else {
        setPage({
          ...page,
          status: 'normal',
        })
      }
    } else {
      for (const key of Object.keys(resSendFile || {})) {
        const senFile = new FormData();
        senFile.append("jenisPrioritas", key);
        senFile.append("file", resSendFile[key]);
        updateLampiranPrioritas({ id: data.id, senFile });
      }
      updatePrioritas(resSend);
    }
  };

  // custom component
  const SwitchCustomLabel = ({ htmlFor }) => {
    return (
      <Label className="form-check-label" htmlFor={htmlFor}>
        <span className="switch-icon-left">
          <Check size={14} />
        </span>
        <span className="switch-icon-right">
          <X size={14} />
        </span>
      </Label>
    );
  };

  const [showUpload, setShowUpload] = useState({});

  const handleSwitchChange = (keyPrioritas, value) => {
    setShowUpload((prevShowUpload) => ({
      ...prevShowUpload,
      [keyPrioritas]: value,
    }));
  };

  const handleDisabled = (id) => {
    if (usulan.DirektoratId !== 4 && (Number(usulan?.jenisData) === Number(id))) {
      return true
    }
    return false
  }

  return (
    <Fragment>
      <Modal
        isOpen={toggle.open}
        toggle={() => setToggle({ open: false })}
        className={`modal-dialog-centered modal-xl`}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={() => setToggle({ open: false })}>
            Edit Checklist Usulan Prioritas
          </ModalHeader>
          <ModalBody>
            {isFetching ? (
              <div
                className="p-4"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="primary" />
              </div>
            ) : (
              <Row>
                {usulan && (
                  <>
                    <Col md="6" className="mb-1">
                      <h5>Detail Usulan</h5>
                      <hr></hr>
                      <Table size="sm" responsive>
                        <tbody>
                          <tr>
                            <td className="row-head">No Usulan</td>
                            <td>{usulan.noUsulan || "-"}</td>
                          </tr>
                          <tr>
                            <td className="row-head">Tipe Usulan</td>
                            <td>
                              {usulan.noUsulan
                                ? _.find(TIPE_USULAN, {
                                    direktorat: usulan.DirektoratId,
                                  })?.name
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td className="row-head">Jenis Usulan</td>
                            {usulan.DirektoratId === 4 && (
                              <td>
                                {usulan.jenisData
                                  ? _.find(JENIS_DATA_USULAN.ruk, {
                                      value: Number(usulan.jenisData),
                                    }).label
                                  : "-"}
                              </td>
                            )}
                            {usulan.DirektoratId !== 4 && (
                              <td>
                                {usulan.jenisData
                                  ? _.find(JENIS_DATA_USULAN.non_ruk, {
                                      value: Number(usulan.jenisData),
                                    })?.label
                                  : "-"}
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    {page.page === 1 ? (
                      <Col md="6" className="mb-1">
                        <h5>Rekomendasi Usulan</h5>
                        <hr />
                        <Table size="sm" responsive>
                          <tbody>
                            {resJenis
                              ?.filter((x) => x?.value !== 5 && x?.value !== 7)
                              ?.map((key) => (
                                <React.Fragment
                                  key={`div-crpjns-${usulan.id}-${key?.keyPrioritas}`}
                                >
                                  <tr>
                                    <td className="row-head">{key?.label}</td>
                                    <td>
                                      <Controller
                                        id={`crpjns-${usulan.id}-${key?.keyPrioritas}`}
                                        name={`crpjns-${key?.keyPrioritas}`}
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <div className="form-switch form-check-primary">
                                            <Input
                                              disabled={handleDisabled(key?.value)}
                                              id={`crpjns-${usulan.id}-${key?.keyPrioritas}`}
                                              type="switch"
                                              checked={handleDisabled(key?.value) ? false : value}
                                              onChange={(e) => {
                                                onChange(e.target.checked);
                                                handleSwitchChange(
                                                  key?.keyPrioritas,
                                                  e.target.checked
                                                );
                                              }}
                                            />
                                            <SwitchCustomLabel
                                              htmlFor={`crpjns-${usulan.id}-${key?.keyPrioritas}`}
                                            />
                                            {errors[
                                                `crpjns-${key?.keyPrioritas}`
                                              ]?.message && (
                                                <FormFeedback>
                                                  {
                                                    errors[
                                                      `crpjns-${key?.keyPrioritas}`
                                                    ]?.message
                                                  }
                                                </FormFeedback>
                                              )}
                                          </div>
                                        )}
                                      />
                                    </td>
                                  </tr>

                                  {!handleDisabled(key?.value) && showUpload[key?.keyPrioritas] && (
                                    <tr>
                                      <Controller
                                        name={`lamp-${key?.keyPrioritas}`}
                                        control={control}
                                        // required={dokumen[key?.keyPrioritas]}
                                        render={({ field: { onChange } }) => {
                                          return (
                                            <div>
                                              <Label
                                                className="form-label"
                                                for="file"
                                              >
                                                File
                                              </Label>
                                              {
                                                dokumen?.filter(x=> x?.jenisPrioritas === key?.keyPrioritas)[0]?.file?.url &&
                                                <Button
                                                  color="primary"
                                                  style={{
                                                    width: '100%',
                                                    marginBottom: 10
                                                  }}
                                                  onClick={()=>{
                                                    window.open(
                                                      dokumen?.filter(x=> x?.jenisPrioritas === key?.keyPrioritas)[0]?.file?.url,
                                                      '_blank'
                                                    );
                                                  }}
                                                >
                                                  File {key?.label}
                                                </Button>
                                              }
                                              <Input
                                                invalid={
                                                  dokumenError[
                                                    `lamp-${key?.keyPrioritas}`
                                                  ]
                                                }
                                                onChange={(event) => {
                                                  const selectedFile =
                                                    event.target.files[0];
                                                  onChange(selectedFile);
                                                }}
                                                type="file"
                                                accept="application/pdf"
                                              />
                                              {dokumenError[
                                                `lamp-${key?.keyPrioritas}`
                                              ] && (
                                                <FormFeedback>
                                                  File wajib diisi!
                                                </FormFeedback>
                                              )}

                                              {/* <FormText>
                                                <span>
                                                  {data.maxSize
                                                    ? `Maksimum Ukuran File: ${data.maxSize} MB`
                                                    : ""}
                                                </span>
                                                <span
                                                  style={{ marginLeft: 10 }}
                                                >
                                                  {data.typeFile
                                                    ? `Tipe File: ${data.typeFile}`
                                                    : ""}
                                                </span>
                                              </FormText> */}
                                              <span>
                                                {dokumen[key?.keyPrioritas] && (
                                                  <a
                                                    href={
                                                      dokumen[key?.keyPrioritas]
                                                        .fileURL
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <File
                                                      size={15}
                                                      style={{
                                                        marginRight: "5px",
                                                      }}
                                                    />
                                                    Lihat Dokumen
                                                  </a>
                                                )}
                                              </span>
                                            </div>
                                          );
                                        }}
                                      />
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                          </tbody>
                        </Table>
                      </Col>
                    ) : (
                      <Col md="6" className="mb-1">
                        <h5>Rangkaian Pemrograman</h5>
                        <hr></hr>
                        <Table size="sm" responsive>
                          <tbody>
                            {Object.keys(resRangkaianProgram).map((key) => {
                              return (
                                <tr key={`div-crp-${usulan.id}-${key}`}>
                                  <td className="row-head">
                                    {resRangkaianProgram?.[key]}
                                  </td>
                                  <td>
                                    <Controller
                                      id={`crp-${usulan.id}-${key}`}
                                      name={`crp-${key}`}
                                      control={control}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <div className="form-switch form-check-primary">
                                          <Input
                                            id={`crp-${usulan.id}-${key}`}
                                            type="switch"
                                            checked={value}
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                          />
                                          <SwitchCustomLabel
                                            htmlFor={`crp-${usulan.id}-${key}`}
                                          />
                                        </div>
                                      )}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Col>
                    )}
                  </>
                )}
              </Row>
            )}
            {!result.isUninitialized && result.isSuccess && (
              <Alert color="success">
                <h4 className="alert-heading">Success</h4>
                <div className="alert-body">Ubah checklist berhasil...</div>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter
            style={{
              display: "flex",
              justifyContent: page.page === 2 && "space-between",
            }}
          >
            {page.page === 1 ? (
              <>
                <Button color="primary" type="submit" outline>
                  Selanjutnya
                </Button>
              </>
            ) : (
              <>
                <Button color="primary" outline onClick={() => {
                  setPage({
                    status: 'prev',
                    page: 1
                  })
                }}>
                  Kembali
                </Button>
                <Button color="primary" type="submit" outline>
                  Ubah Checklist
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default EditChecklist;
