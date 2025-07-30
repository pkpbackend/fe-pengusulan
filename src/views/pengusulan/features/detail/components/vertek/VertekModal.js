// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Download } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Controller, useForm } from "react-hook-form";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  UncontrolledAccordion,
  FormFeedback,
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateVertekMutation } from "../../../../domains";
import LinkS3 from "../../../../../../components/LinkS3";
import { formVertekSchema } from "./schema";
import "./VertekModal.scss";
import sweetalert from "@src/utility/sweetalert";

export const dataUmumFields = [
  {
    id: "namaLokasiDetail",
    label: "Nama Lokasi (detail)",
  },
  {
    id: "titikKoordinat",
    label: "Titik Koordinat",
  },
  {
    id: "peruntukan",
    label: "Peruntukan",
  },
  {
    id: "tglVertek",
    label: "Tanggal Vertek",
    type: "date",
  },
  {
    id: "statusLahan",
    label: "Status Lahan",
  },
  {
    id: "rtrw",
    label: "RT RW",
  },
];
export const dataLahanFields = [
  {
    id: "luasLahan",
    label: "Luas Lahan",
  },
  {
    id: "kondisiLahan",
    label: "Kondisi Lahan",
  },
  {
    id: "kondisiJalanAkses",
    label: "Kondisi Jalan Akses",
  },
  {
    id: "jauhLahanDariJalanUtama",
    label: "Jarak dari Jalan Utama",
  },
  {
    id: "sumberAirBersih",
    label: "Sumber Air Bersih",
  },
  {
    id: "sumberPenerbanganDanJarakGardu",
    label: "Jarak Gardu PLN",
  },
  {
    id: "aksesSaluranPembuangan",
    label: "Akses Saluran Pembuangan",
  },
  {
    id: "groundJarak",
    label: "Jarak Garis Sepadan Pantai",
  },
  {
    id: "sitePlant",
    label: "Site Plan",
  },
  {
    id: "jenisTanah",
    label: "Jenis Tanah",
  },
  {
    id: "tipologiPermukaanTanah",
    label: "Tipologi Permukaan Tanah",
  },
  {
    id: "rawanBencana",
    label: "Daerah Rawan Bencana",
  },
];
export const dataLainFields = [
  {
    id: "catatan",
    label: "Catatan",
  },
];

const SectionPersonilFields = ({ control, title = "", nameField }) => {
  return (
    <Row className="gy-1">
      <Col md={12}>
        <span className="section-title">{title}</span>
      </Col>
      <Col md={12}>
        <Controller
          name={`nama${nameField}`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Input value={value} onChange={onChange} placeholder="Nama" />
            );
          }}
        />
      </Col>
      <Col md={12}>
        <Controller
          name={`jabatan${nameField}`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Input value={value} onChange={onChange} placeholder="Jabatan" />
            );
          }}
        />
      </Col>
      <Col md={12}>
        <Controller
          name={`nip${nameField}`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Input value={value} onChange={onChange} placeholder="NIP" />
            );
          }}
        />
      </Col>
      <Col md={12}>
        <Controller
          name={`telpon${nameField}`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Input value={value} onChange={onChange} placeholder="Telepon" />
            );
          }}
        />
      </Col>
    </Row>
  );
};

const getDefaultValues = (data) => {
  const fields = [
    "namaPupr",
    "jabatanPupr",
    "nipPupr",
    "telponPupr",
    "namaSnvt",
    "jabatanSnvt",
    "nipSnvt",
    "telponSnvt",
    "namaPejKabKota",
    "jabatanPejKabKota",
    "nipPejKabKota",
    "telponPejKabKota",
    ...dataUmumFields.map((field) => field.id),
    ...dataLahanFields.map((field) => field.id),
    ...dataLainFields.map((field) => field.id),
  ].reduce((a, v) => ({ ...a, [v]: data?.[v] ?? "" }), {});
  return {
    ...fields,
    fileFoto: data.fileFoto || null,
    fileVertek: data.fileVertek || null,
  };
};

const FormVertek = ({ data, onSubmit, onClose }) => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(data),
    resolver: yupResolver(formVertekSchema()),
  });

  return (
    <Form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
      <ModalHeader toggle={() => onClose()}>Verifikasi Teknis</ModalHeader>
      <ModalBody>
        <Row className="gy-2">
          <Col md={12}>
            <UncontrolledAccordion
              className="accordion-border accordion-background"
              style={{ borderRadius: "0.428rem" }}
              defaultOpen={["data-location-personal"]}
            >
              <AccordionItem>
                <AccordionHeader targetId="data-location-personal">
                  Personil
                </AccordionHeader>
                <AccordionBody accordionId="data-location-personal">
                  <Row className="gx-3">
                    <Col md={4}>
                      <SectionPersonilFields
                        title="VALIDATOR PUPR"
                        nameField="Pupr"
                        control={control}
                      />
                    </Col>
                    <Col md={4}>
                      <SectionPersonilFields
                        title="BALAI/SATKER"
                        nameField="Snvt"
                        control={control}
                      />
                    </Col>
                    <Col md={4}>
                      <SectionPersonilFields
                        title="Pej. KAB/KOTA"
                        nameField="PejKabKota"
                        control={control}
                      />
                    </Col>
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion>
          </Col>
          <Col md={12}>
            <UncontrolledAccordion
              className="accordion-border accordion-background"
              style={{ borderRadius: "0.428rem" }}
              defaultOpen={["data-location-data-lapangan"]}
            >
              <AccordionItem>
                <AccordionHeader targetId="data-location-data-lapangan">
                  Data Lapangan
                </AccordionHeader>
                <AccordionBody
                  accordionId="data-location-data-lapangan"
                  style={{ paddingTop: "0.5rem" }}
                >
                  <Row className="gy-2">
                    <Col md={12}>
                      <span className="section-title">DATA UMUM</span>
                      <Table responsive bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Uraian</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataUmumFields.map((field, index) => {
                            return (
                              <tr key={field.id}>
                                <td>{index + 1}</td>
                                <td>{field.label}</td>
                                <td>
                                  <Controller
                                    name={field.id}
                                    control={control}
                                    render={({ field: controlField }) => {
                                      return field.type === "date" ? (
                                        <Flatpickr
                                          {...controlField}
                                          className="form-control"
                                          options={{
                                            dateFormat: "d-m-Y",
                                          }}
                                          onChange={(date) => {
                                            controlField.onChange(date[0]);
                                          }}
                                        />
                                      ) : (
                                        <Input
                                          {...controlField}
                                          type="textarea"
                                          rows={1}
                                        />
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={12}>
                      <span className="section-title">DATA LAHAN</span>
                      <Table responsive bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Uraian</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataLahanFields.map((field, index) => {
                            return (
                              <tr key={field.id}>
                                <td>{index + 1}</td>
                                <td>{field.label}</td>
                                <td>
                                  <Controller
                                    name={field.id}
                                    control={control}
                                    render={({
                                      field: { value, onChange },
                                    }) => {
                                      return (
                                        <Input
                                          value={value}
                                          onChange={onChange}
                                          type="textarea"
                                          rows={1}
                                        />
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={12}>
                      <span className="section-title">LAIN-LAIN</span>
                      <Table responsive bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Uraian</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataLainFields.map((field, index) => {
                            return (
                              <tr key={field.id}>
                                <td>{index + 1}</td>
                                <td>{field.label}</td>
                                <td>
                                  <Controller
                                    name={field.id}
                                    control={control}
                                    render={({
                                      field: { value, onChange },
                                    }) => {
                                      return (
                                        <Input
                                          value={value}
                                          onChange={onChange}
                                          type="textarea"
                                          rows={1}
                                        />
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={12}>
                      <Controller
                        name="fileFoto"
                        control={control}
                        render={({ field: { onChange } }) => {
                          return (
                            <div>
                              <span className="section-title">
                                DOKUMEN FOTO{" "}
                                <span className="text-danger">*</span>
                              </span>
                              <Input
                                invalid={errors.fileFoto}
                                onChange={(event) => {
                                  onChange(event.target.files[0]);
                                }}
                                type="file"
                              />
                              {errors.fileFoto && (
                                <FormFeedback>
                                  {errors.fileFoto.message}
                                </FormFeedback>
                              )}
                            </div>
                          );
                        }}
                      />
                      {data.fileFoto ? (
                        <LinkS3
                          rel="noopener noreferrer"
                          href={data.fileFoto}
                          model={"Vertek"}
                          className="btn btn-link btn-sm"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Download size={16} /> Lihat Dokumen
                        </LinkS3>
                      ) : null}
                      {/* {data.fileFoto ? (
                        <a
                          className="btn btn-link btn-sm"
                          rel="noopener noreferrer"
                          href={data.fileFoto}
                          target="_blank"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Download size={16} /> Lihat Dokumen
                        </a>
                      ) : null} */}
                    </Col>
                    <Col md={12}>
                      <Controller
                        name="fileVertek"
                        control={control}
                        render={({ field: { onChange } }) => {
                          return (
                            <div>
                              <span className="section-title">
                                DOKUMEN VERTEK{" "}
                                <span className="text-danger">*</span>
                              </span>
                              <Input
                                invalid={errors.fileVertek}
                                onChange={(event) => {
                                  onChange(event.target.files[0]);
                                }}
                                type="file"
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
                      {data.fileVertek ? (
                        <LinkS3
                          rel="noopener noreferrer"
                          href={data.fileVertek}
                          model={"Vertek"}
                          className="btn btn-link btn-sm"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Download size={16} /> Lihat Dokumen
                        </LinkS3>
                      ) : null}
                      {/* {data.fileVertek ? (
                        <a
                          className="btn btn-link btn-sm"
                          rel="noopener noreferrer"
                          href={data.fileVertek}
                          target="_blank"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Download size={16} /> Lihat Dokumen
                        </a>
                      ) : null} */}
                    </Col>
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onClose} outline>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Simpan
        </Button>
      </ModalFooter>
    </Form>
  );
};
const VertekModal = (props) => {
  const { isOpen, onClose, dataVertek } = props;
  // query
  const [updateVertek] = useUpdateVertekMutation();

  const onSubmit = async (data) => {
    try {
      await updateVertek({
        ...data,
        id: dataVertek.SasaranId,
        SasaranId: dataVertek.SasaranId,
        UsulanId: dataVertek.UsulanId,
      }).unwrap();
      sweetalert
        .fire("Sukses", "Update vertek berhasil...", "success")
        .then(() => {
          onClose();
        });
    } catch (error) {
      sweetalert.fire("Gagal", "Update vertek gagal...", "error");
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={() => onClose()}
        className={`modal-dialog-centered modal-lg`}
      >
        {dataVertek && (
          <FormVertek data={dataVertek} onSubmit={onSubmit} onClose={onClose} />
        )}
      </Modal>
    </Fragment>
  );
};

export default VertekModal;
