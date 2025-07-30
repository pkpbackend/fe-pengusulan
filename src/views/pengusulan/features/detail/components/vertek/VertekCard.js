import React, { useState } from "react";
import {
  Briefcase,
  CreditCard,
  Download,
  Edit2,
  Phone,
  User,
} from "react-feather";

import moment from "moment";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Button,
  ButtonGroup,
  Col,
  Row,
  Table,
  UncontrolledAccordion,
  Label,
} from "reactstrap";
import { useVertekByLocationQuery } from "../../../../domains";
import LinkS3 from "../../../../../../components/LinkS3";
import VertekModal, {
  dataLahanFields,
  dataLainFields,
  dataUmumFields,
} from "./VertekModal";
import VertekValidationModal from "./VertekValidationModal";

const VertekAlert = ({ status }) => {
  let displayText = "Belum Verifikasi";
  let alertColor = "secondary";
  if (status === 1) {
    displayText = "Vertek Layak";
    alertColor = "primary";
  }
  if (status === 0) {
    displayText = "Vertek Tidak Layak";
    alertColor = "danger";
  }
  return (
    <Alert color={alertColor}>
      <div className="alert-body d-flex align-items-center justify-content-center">
        <span className="ms-50 fs-4">{displayText}</span>
      </div>
    </Alert>
  );
};

const SectionPersonilFields = ({ title = "", data }) => {
  const { name, position, nip, phone } = data;
  const iconSize = 16;
  return (
    <Row className="gy-1">
      <Col md={12}>
        <span className="section-title">{title}</span>
        <Table hover size="sm">
          <tbody>
            <tr>
              <td style={{ width: 20 }}>
                <User size={iconSize} />
              </td>
              <td style={{ width: 20 }}>:</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>
                <Briefcase size={iconSize} />
              </td>
              <td>:</td>
              <td>{position}</td>
            </tr>
            <tr>
              <td>
                <CreditCard size={iconSize} />
              </td>
              <td>:</td>
              <td>{nip}</td>
            </tr>
            <tr>
              <td>
                <Phone size={iconSize} />
              </td>
              <td>:</td>
              <td>{phone}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

const VertekCard = ({ locations = [], usulan }) => {
  const [toggleVertekModal, setToggleVertekModal] = useState(false);
  const [toggleVertekValidatioModal, setToggleVertekValidationModal] =
    useState(false);
  const [activeLocationId, setActiveLocationId] = useState(
    () =>
      // locations.length === 0 ? usulan.id : null
      usulan.id
  );
  let { data } = useVertekByLocationQuery(activeLocationId, {
    skip: !activeLocationId,
  });

  return (
    <>
      <UncontrolledAccordion
        className="shadow"
        style={{ borderRadius: "0.428rem" }}
        defaultOpen="data-vertek"
        stayOpen
      >
        <AccordionItem>
          <AccordionHeader
            targetId="data-vertek"
            className="title-accordion-text"
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "100%", paddingRight: "1rem" }}
            >
              Verifikasi Teknis
              {usulan.statusVermin === 1 && (
                <div className="d-flex">
                  <span
                    className="btn btn-primary btn-sm"
                    tabIndex={-1}
                    role="button"
                    style={{ marginLeft: 8 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setToggleVertekValidationModal(true);
                    }}
                  >
                    Verifikasi
                  </span>
                </div>
              )}
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="data-vertek">
            {usulan.statusVermin === 1 ? (
              <>
                {/* change false condition below to locations.length > 0  */}
                {false ? (
                  <Row>
                    <Col sm="4">
                      <ButtonGroup vertical style={{ width: "100%" }}>
                        {locations.map((location, index) => {
                          const isActive = location.id === activeLocationId;
                          const rususContent = (
                            <>
                              <b>Kec:</b>{" "}
                              {location.Kecamatan &&
                                (location.KecamatanId === 0
                                  ? location.KecamatanLainnya
                                  : location.Kecamatan.nama)}{" "}
                              <br />
                              <b>Desa:</b>{" "}
                              {location.Desa &&
                                (location.DesaId === 0
                                  ? location.DesaLainnya
                                  : location.Desa.nama)}
                            </>
                          );
                          const ruswaContent = (
                            <>
                              {/* Jenis Usulan: Bukan dari anggota lembaga tinggi negara*/}
                              {Number(usulan.jenisData) === 1 ||
                              Number(usulan.jenisData) === 5 ? (
                                <>
                                  <b>Kec:</b>{" "}
                                  {location.Kecamatan &&
                                    (location.KecamatanId === 0
                                      ? location.KecamatanLainnya
                                      : location.Kecamatan.nama)}{" "}
                                  <br />
                                  <b>Desa:</b>{" "}
                                  {location.Desa &&
                                    (location.DesaId === 0
                                      ? location.DesaLainnya
                                      : location.Desa.nama)}
                                </>
                              ) : (
                                <>
                                  {location.Provinsi &&
                                    (location.ProvinsiId === 0
                                      ? location.ProvinsiLainnya
                                      : location.Provinsi.nama)}{" "}
                                </>
                              )}
                            </>
                          );
                          return (
                            <Button
                              key={location.id}
                              outline={!isActive}
                              color={isActive ? "primary" : "secondary"}
                              style={{
                                display: "inline-block",
                                textAlign: "start",
                              }}
                              onClick={() => setActiveLocationId(location.id)}
                            >
                              {usulan.DirektoratId === 2 && rususContent}
                              {usulan.DirektoratId === 3 && ruswaContent}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </Col>
                    <Col sm="8">
                      {activeLocationId ? (
                        <UncontrolledAccordion className="accordion-border accordion-background">
                          <AccordionItem>
                            <AccordionHeader
                              targetId={`data-vertek-${activeLocationId}`}
                              className="title-accordion-text"
                            >
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ width: "100%", paddingRight: "1rem" }}
                              >
                                Verifikasi Teknis
                                <div className="d-flex">
                                  <span
                                    className="btn btn-primary btn-sm"
                                    tabIndex={-1}
                                    role="button"
                                    style={{ marginLeft: 8 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setToggleVertekValidationModal(true);
                                    }}
                                  >
                                    Verifikasi
                                  </span>

                                  {usulan.DirektoratId === 2 && (
                                    <span
                                      className="btn btn-icon btn-outline-primary btn-sm"
                                      tabIndex={-1}
                                      role="button"
                                      style={{ marginLeft: 8 }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setToggleVertekModal(true);
                                      }}
                                    >
                                      <Edit2 size={16} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </AccordionHeader>
                            <AccordionBody
                              accordionId={`data-vertek-${activeLocationId}`}
                            >
                              {usulan.DirektoratId === 2 && (
                                <>
                                  {data ? (
                                    <Row className="gy-1">
                                      <Col md={12}>
                                        <SectionPersonilFields
                                          title="VALIDATOR PUPR"
                                          data={{
                                            name: data.namaPupr,
                                            position: data.jabatanPupr,
                                            nip: data.nipPupr,
                                            phone: data.telponPupr,
                                          }}
                                        />
                                      </Col>
                                      <Col md={12}>
                                        <SectionPersonilFields
                                          title="BALAI/SATKER"
                                          data={{
                                            name: data.namaSnvt,
                                            position: data.jabatanSnvt,
                                            nip: data.nipSnvt,
                                            phone: data.telponSnvt,
                                          }}
                                        />
                                      </Col>
                                      <Col md={12}>
                                        <SectionPersonilFields
                                          title="Pej. KAB/KOTA"
                                          data={{
                                            name: data.namaPejKabKota,
                                            position: data.jabatanPejKabKota,
                                            nip: data.nipPejKabKota,
                                            phone: data.telponPejKabKota,
                                          }}
                                        />
                                      </Col>
                                      <Col md={12}>
                                        <span className="section-title">
                                          DATA UMUM
                                        </span>
                                        <Table
                                          responsive
                                          bordered
                                          hover
                                          size="sm"
                                        >
                                          <thead>
                                            <tr>
                                              <th>No</th>
                                              <th>Uraian</th>
                                              <th>Keterangan</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {dataUmumFields.map(
                                              (field, index) => {
                                                return (
                                                  <tr key={field.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{field.label}</td>
                                                    <td>
                                                      {field.type === "date"
                                                        ? data[field.id]
                                                          ? moment(
                                                              data[field.id]
                                                            ).format(
                                                              "DD-MM-YYYY"
                                                            )
                                                          : ""
                                                        : data[field.id]}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col md={12}>
                                        <span className="section-title">
                                          DATA LAHAN
                                        </span>
                                        <Table
                                          responsive
                                          bordered
                                          hover
                                          size="sm"
                                        >
                                          <thead>
                                            <tr>
                                              <th>No</th>
                                              <th>Uraian</th>
                                              <th>Keterangan</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {dataLahanFields.map(
                                              (field, index) => {
                                                return (
                                                  <tr key={field.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{field.label}</td>
                                                    <td>{data[field.id]}</td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col md={12}>
                                        <span className="section-title">
                                          LAIN-LAIN
                                        </span>
                                        <Table
                                          responsive
                                          bordered
                                          hover
                                          size="sm"
                                        >
                                          <thead>
                                            <tr>
                                              <th>No</th>
                                              <th>Uraian</th>
                                              <th>Keterangan</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {dataLainFields.map(
                                              (field, index) => {
                                                return (
                                                  <tr key={field.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{field.label}</td>
                                                    <td>{data[field.id]}</td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col md={12}>
                                        <div>
                                          <span className="section-title">
                                            DOKUMEN FOTO
                                          </span>
                                          <div>
                                            {data.fileFoto ? (
                                              <a
                                                className="btn btn-secondary btn-sm"
                                                rel="noopener noreferrer"
                                                href={data.fileFoto}
                                                target="_blank"
                                                style={{
                                                  display: "inline-flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <Download size={16} /> Lihat
                                                Dokumen
                                              </a>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </div>
                                      </Col>
                                      <Col md={12}>
                                        <div>
                                          <span className="section-title">
                                            DOKUMEN VERTEK
                                          </span>
                                          <div>
                                            {data.fileVertek ? (
                                              <a
                                                className="btn btn-secondary btn-sm"
                                                rel="noopener noreferrer"
                                                href={data.fileVertek}
                                                target="_blank"
                                                style={{
                                                  display: "inline-flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <Download size={16} /> Lihat
                                                Dokumen
                                              </a>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  ) : (
                                    <Alert
                                      color="warning"
                                      style={{ padding: "2rem" }}
                                    >
                                      Tidak ditemukan Data Vertek pada lokasi
                                      sasaran yang dipilih
                                    </Alert>
                                  )}
                                </>
                              )}
                            </AccordionBody>
                            <div style={{ padding: "1rem" }}>
                              <VertekAlert status={data?.status ?? ""} />
                              {data?.keterangan ? (
                                <div className="mt-1">
                                  <Label style={{ fontWeight: 600 }}>
                                    Keterangan:
                                  </Label>
                                  <p style={{ marginBottom: 0 }}>
                                    {data?.keterangan ?? "-"}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </AccordionItem>
                        </UncontrolledAccordion>
                      ) : (
                        <Alert color="warning" style={{ padding: "2rem" }}>
                          Silahkan pilih lokasi sasaran
                        </Alert>
                      )}
                    </Col>
                  </Row>
                ) : null}
              </>
            ) : (
              <Alert color="warning" style={{ padding: "2rem" }}>
                Vertek belum bisa dilakukan
              </Alert>
            )}
            {usulan.statusVermin === 1 && (
              <div style={{ marginTop: -16 }}>
                <div className="mt-1">
                  <VertekAlert status={data?.status ?? ""} />
                </div>
                {data?.keterangan ? (
                  <div className="mt-1">
                    <Label style={{ fontWeight: 600 }}>Keterangan:</Label>
                    <p style={{ marginBottom: 0 }}>{data?.keterangan ?? "-"}</p>
                  </div>
                ) : null}
                {data?.fileVertek ? (
                  <div className="mt-1">
                    <Label style={{ fontWeight: 600 }}>Dokumen Vertek:</Label>
                    <br />
                    <LinkS3
                      rel="noopener noreferrer"
                      href={data.fileVertek}
                      model={"Vertek"}
                      className="btn btn-link btn-sm justify-content-start ps-0"
                    >
                      <Download size={16} /> Lihat Dokumen
                    </LinkS3>
                  </div>
                ) : null}
              </div>
            )}
          </AccordionBody>
        </AccordionItem>
      </UncontrolledAccordion>
      <VertekModal
        isOpen={toggleVertekModal}
        onClose={() => {
          setToggleVertekModal(false);
        }}
        dataVertek={{
          ...data,
          SasaranId: activeLocationId,
          UsulanId: usulan.id,
        }}
      />

      <VertekValidationModal
        isOpen={toggleVertekValidatioModal}
        onClose={() => {
          setToggleVertekValidationModal(false);
        }}
        dataVertek={{
          SasaranId: activeLocationId,
          UsulanId: usulan.id,
          status: data?.status ?? "",
          keterangan: data?.keterangan,
          type: "usulan",
          fileVertek: data?.fileVertek,
        }}
      />
    </>
  );
};

export default VertekCard;
