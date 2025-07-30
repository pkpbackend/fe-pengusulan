import { useEffect, useState } from "react";

// ** Custom Components

// ** Utils
import { OPTION_ALL } from "@constants/global";
import { JENIS_DATA_USULAN, TIPE_USULAN } from "@constants/usulan";
import { CheckSquare, Search } from "react-feather";
import {
  useDesaQuery,
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
} from "../../../../../api/domains/wilayah";

// ** Third Party Components
import { getPenerimaManfaat, getTahunUsulan } from "@api/ApiCallV2Old";
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select"; // eslint-disable-line

// ** Reactstrap Imports
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import Options from "./modals/Options";

const defaultValues = {
  jenisData: "",
  jenisUsulan: "",
  provinsi: "",
  kabupaten: "",
};

const Filter = (props) => {
  const { handleTableAttrChange, loading } = props;
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  const [listPenerimaManfaat, setListPenerimaManfaat] = useState([]);
  const [listTahunSuratUsulan, setListTahunSuratUsulan] = useState([]);
  const [listTahunUsulan, setListTahunUsulan] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    prioritasJenis: [],
    prioritasRangkaianPemrograman: [],
  });

  // ** Local State
  const [options, setOptions] = useState({
    jenisUsulan: [OPTION_ALL],
    jenisData: [OPTION_ALL],
  });

  // ** Hooks
  const { control, watch, handleSubmit, reset } = useForm({
    defaultValues,
  });
  const provinsiId = watch("ProvinsiId");
  const kabupatenId = watch("CityId");
  const kecamatanId = watch("KecamatanId");

  // query
  const queryProvinsi = useProvinsiQuery();
  const queryKabupaten = useKabupatenQuery(provinsiId);
  const queryKecamatan = useKecamatanQuery(kabupatenId);
  const queryDesa = useDesaQuery(kecamatanId);

  useEffect(() => {
    const isValidDirektoratId = parseFloat(watch("jenisUsulan")) > 0;

    async function fetchPenerimaManfaat() {
      const res = await getPenerimaManfaat({
        id: watch("jenisUsulan"),
      });

      setListPenerimaManfaat([
        OPTION_ALL,
        ...res.penerima?.map((item) => ({
          value: item.id,
          label: item.tipe,
          original: item,
        })),
      ]);
    }

    if (isValidDirektoratId) {
      fetchPenerimaManfaat();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("jenisUsulan")]);

  useEffect(() => {
    setOptions((val) => ({
      ...val,
      jenisUsulan: [
        OPTION_ALL,
        ...TIPE_USULAN.map((item) => ({
          value: item.direktorat,
          label: item.name,
        })),
      ],
    }));

    async function init() {
      try {
        const fetchPenerimaManfaat = await getPenerimaManfaat();
        const fetchTahunanOptions = await getTahunUsulan();

        setListPenerimaManfaat([
          OPTION_ALL,
          ...fetchPenerimaManfaat.penerima.map((item) => ({
            value: item.id,
            label: item.tipe,
            original: item,
          })),
        ]);

        setListTahunSuratUsulan([
          OPTION_ALL,
          ...fetchTahunanOptions.tahunSurat.map((item) => ({
            value: item,
            label: item,
          })),
        ]);

        setListTahunUsulan([
          OPTION_ALL,
          ...fetchTahunanOptions.tahunUsulan.map((item) => ({
            value: item,
            label: item,
          })),
        ]);
      } catch (err) {}
    }

    init();
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "DirektoratId" && type === "change") {
        if (value.DirektoratId < 4) {
          setOptions((val) => ({
            ...val,
            jenisData: [
              OPTION_ALL,
              ...JENIS_DATA_USULAN.non_ruk.map((item) => ({
                ...item,
              })),
            ],
          }));
        } else if (value.DirektoratId === 4) {
          setOptions((val) => ({
            ...val,
            jenisData: [
              OPTION_ALL,
              ...JENIS_DATA_USULAN.ruk
                .filter((item) => item.create)
                .map((item) => ({
                  ...item,
                })),
            ],
          }));
        } else {
          setOptions((val) => ({
            ...val,
            jenisData: [OPTION_ALL],
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    const filtered = [];
    const sorted = [];
    const convertKey = (key, sort) => {
      if (sort) {
        return key?.split("_")?.[1];
      }
      return key?.split("_").join(".");
    };

    for (const key of Object.keys(data || {})) {
      if (
        typeof data[key] == "string" &&
        (data[key] || "").includes("sorted_")
      ) {
        sorted.push({
          id: key,
          [convertKey(data?.[key], true)]: true,
        });
      } else {
        if (data?.[key]) {
          filtered.push({
            id: convertKey(key),
            value: data?.[key],
          });
        }
      }
    }

    if (filterOptions?.prioritasJenis?.length) {
      filtered.push({
        id: "prioritasJenis",
        value: filterOptions?.prioritasJenis.join(","),
      });
    }

    if (filterOptions?.prioritasRangkaianPemrograman?.length) {
      filtered.push({
        id: "prioritasRangkaianPemrograman",
        value: filterOptions?.prioritasRangkaianPemrograman.join(","),
      });
    }

    handleTableAttrChange({
      filtered: filtered.length ? filtered : null,
      sorted: sorted.length ? sorted : null,
      page: 1,
    });
  };

  // controlled select options
  const optionsProvinsi = [
    OPTION_ALL,
    ...(queryProvinsi?.data?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || []),
  ];

  const optionsKabupaten = [
    OPTION_ALL,
    ...(queryKabupaten?.data?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || []),
  ];

  const optionsKecamatan = [
    OPTION_ALL,
    ...(queryKecamatan?.data?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || []),
  ];

  const optionsDesa = [
    OPTION_ALL,
    ...(queryDesa?.data?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || []),
  ];

  const listStatusTerkirim = [
    { value: "", label: "Semua..." },
    { value: "terkirim", label: "Terkirim" },
    { value: "expired", label: "Expired" },
    { value: "Di SK kan", label: "SK" },
    { value: "revisi", label: "Revisi" },
    { value: "belum terkirim", label: "Belum Terkirim" },
  ];

  const terbaruTerkirim = [
    { value: "", label: "Semua..." },
    { value: "sorted_desc", label: "Terbaru" },
    { value: "sorted_asc", label: "Terlama" },
  ];

  const bobotUsulanPrioritas = [
    { value: "", label: "Semua..." },
    { value: "sorted_desc", label: "Tertinggi" },
    { value: "sorted_asc", label: "Terendah" },
  ];

  const listSiproPool = [
    { value: "", label: "Semua..." },
    { value: "belum", label: "Belum" },
    { value: "pool", label: "Pool" },
    { value: "sync", label: "Sync" },
  ];

  const [toggleModalOptions, setToggleModalOptions] = useState(false);

  return (
    <Accordion
      className="mb-2 shadow"
      style={{ borderRadius: "0.428rem" }}
      open={open}
      toggle={toggle}
    >
      <AccordionItem>
        <AccordionHeader
          targetId="1"
          style={{ paddingRight: ".5rem", paddingLeft: ".5rem" }}
        >
          <span style={{ fontSize: "1.285rem" }}>Filter</span>
        </AccordionHeader>
        <AccordionBody accordionId="1">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="DirektoratId">
                      Tipe Usulan
                    </Label>
                    <Controller
                      id="DirektoratId"
                      name="DirektoratId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            options.jenisUsulan.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={options.jenisUsulan}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="PenerimaManfaatId">
                      Penerima Manfaat
                    </Label>
                    <Controller
                      id="PenerimaManfaatId"
                      name="PenerimaManfaatId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            listPenerimaManfaat.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={listPenerimaManfaat}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="User">
                      User Pengusul
                    </Label>
                    <Controller
                      id="User"
                      name="User"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          placeholder="Pengusul..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(event) => {
                            onChange(event?.target?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="statusTerkirim">
                      Status Usulan
                    </Label>
                    <Controller
                      id="statusTerkirim"
                      name="statusTerkirim"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            listStatusTerkirim.find((c) => c.value === value) ||
                            ""
                          }
                          options={listStatusTerkirim}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>

              <Col md="4" className="mb-1">
                <Row>
                  {/* <Col md="12" className="mb-1">
                  <Label className="form-label" for="statusVermin">
                    Status Verifikasi
                  </Label>
                  <Controller
                    id="statusVermin"
                    name="statusVermin"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={
                          listStatusVermin.find((c) => c.value === value) ||
                          ""
                        }
                        options={listStatusVermin}
                        placeholder="Silahkan pilih..."
                        className={classnames("react-select")}
                        classNamePrefix="select"
                        onChange={(val) => {
                          onChange(val.value)
                        }}
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 })
                        }}
                      />
                    )}
                  />
                </Col> */}
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="siproPool">
                      Konreg Pool
                    </Label>
                    <Controller
                      control={control}
                      id="siproPool"
                      name="siproPool"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            listSiproPool.find((c) => c.value === value) || ""
                          }
                          options={listSiproPool}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="tahunSurat">
                      Tahun Surat
                    </Label>
                    <Controller
                      id="tahunSurat"
                      name="tahunSurat"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            listTahunSuratUsulan?.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={listTahunSuratUsulan}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="tahunUsulan">
                      Tahun Usulan
                    </Label>
                    <Controller
                      id="tahunUsulan"
                      name="tahunUsulan"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            listTahunUsulan.find((c) => c.value === value) || ""
                          }
                          options={listTahunUsulan}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="jenisData">
                      Jenis Usulan
                    </Label>
                    <Controller
                      control={control}
                      id="jenisData"
                      name="jenisData"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            options.jenisData.find((c) => c.value === value) ||
                            ""
                          }
                          options={options.jenisData}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>

              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="ProvinsiId">
                      Provinsi
                    </Label>
                    <Controller
                      id="ProvinsiId"
                      name="ProvinsiId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            optionsProvinsi.find((c) => c.value === value) || ""
                          }
                          options={optionsProvinsi}
                          placeholder="Silahkan pilih..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="CityId">
                      Kabupaten
                    </Label>
                    <Controller
                      control={control}
                      id="CityId"
                      name="CityId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={
                            optionsKabupaten.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKabupaten}
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          placeholder="Silahkan pilih..."
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="KecamatanId">
                      Kecamatan
                    </Label>
                    <Controller
                      control={control}
                      id="KecamatanId"
                      name="KecamatanId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={
                            optionsKecamatan.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKecamatan}
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          placeholder="Silahkan pilih..."
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="DesaId">
                      Desa
                    </Label>
                    <Controller
                      control={control}
                      id="DesaId"
                      name="DesaId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={
                            optionsDesa.find((c) => c.value === value) || ""
                          }
                          options={optionsDesa}
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          placeholder="Silahkan pilih..."
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="noUsulan">
                      Nomor Usulan
                    </Label>
                    <Controller
                      id="noUsulan"
                      name="noUsulan"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Input
                          placeholder="Nomor Usulan..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(event) => {
                            onChange(event?.target?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="Pengembang">
                      Nama Perusahaan
                    </Label>
                    <Controller
                      id="Pengembang"
                      name="Pengembang"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          placeholder="Nama Perusahaan..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(event) => {
                            onChange(event?.target?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="namaPerumahan">
                      Nama Perumahan
                    </Label>
                    <Controller
                      id="namaPerumahan"
                      name="namaPerumahan"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          placeholder="Nama Perumahan..."
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          onChange={(event) => {
                            onChange(event?.target?.value || "");
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="createdAt">
                      Tampilkan Usulan
                    </Label>
                    <Controller
                      id="createdAt"
                      name="createdAt"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            terbaruTerkirim.find((c) => c.value === value) || ""
                          }
                          options={terbaruTerkirim}
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          placeholder="Silahkan pilih..."
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="prioritasNilai">
                      Bobot Usulan
                    </Label>
                    <Controller
                      id="prioritasNilai"
                      name="prioritasNilai"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={
                            bobotUsulanPrioritas.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={bobotUsulanPrioritas}
                          className={classnames("react-select")}
                          classNamePrefix="select"
                          placeholder="Silahkan pilih..."
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="checklist">
                      Checklist Usulan Prioritas
                    </Label>
                    <Controller
                      id="checklist"
                      name="checklist"
                      control={control}
                      render={() => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          <Input
                            type="button"
                            className={classnames("react-select")}
                            classNamePrefix="select"
                            value="Pilih Usulan Prioritas"
                            menuPlacement="auto"
                            menuPortalTarget={document.body}
                            onClick={() => {
                              setToggleModalOptions(true);
                            }}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                          {filterOptions?.prioritasJenis?.length ||
                          filterOptions?.prioritasRangkaianPemrograman
                            ?.length ? (
                            <CheckSquare
                              size={20}
                              style={{
                                position: "absolute",
                                right: 20,
                                color: "var(--bs-primary)",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    />
                    {toggleModalOptions && (
                      <Options
                        initialValues={filterOptions}
                        open={toggleModalOptions}
                        onClose={() => {
                          setToggleModalOptions(false);
                        }}
                        onSubmit={(values) => {
                          setFilterOptions(values);
                          setToggleModalOptions(false);
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="filter-actions">
              <Button
                color="secondary"
                outline
                onClick={() => {
                  reset();
                  setFilterOptions({
                    prioritasJenis: [],
                    prioritasRangkaianPemrograman: [],
                  });
                  handleTableAttrChange({ filtered: null });
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : <Search size={16} />}
                Cari
              </Button>
            </div>
          </Form>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;
