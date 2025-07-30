import { useState, useEffect } from "react";

// ** Utils
import {
  TIPE_USULAN,
  JENIS_DATA_USULAN,
  ALL_DIREKTORAT_ID,
} from "@constants/usulan";
import { OPTION_ALL } from "@constants/global";
import {
  useKabupatenQuery,
  useProvinsiQuery,
  useKecamatanQuery,
  useDesaQuery,
} from "@globalapi/wilayah";
import {
  usePenerimaManfaatQuery,
  useFilterTahunUsulanQuery,
} from "@globalapi/usulan";

// ** Third Party Components
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Row,
  Col,
  Button,
  Input,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Spinner,
} from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import { Search } from "react-feather";
import { useSelector } from "react-redux";

const SELECTED_PROVINCE_SCOPE_REGION_ROLE__ID = 4;

const Filter = (props) => {
  const userDirektoratId = useSelector(
    (state) => state.auth.user?.Role?.DirektoratId
  );
  const userRegion = useSelector((state) => state.auth.user.region);
  const userScopeRole = useSelector(
    (state) => state.auth.user?.Role?.ScopeRegionRoleId
  );

  const { handleTableAttrChange, loading } = props;

  // ** Local State
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  const [options, setOptions] = useState({
    jenisUsulan: [OPTION_ALL],
    jenisData: [OPTION_ALL],
  });

  // ** Hooks
  const { control, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      DirektoratId: userDirektoratId
        ? userDirektoratId !== 999
          ? userDirektoratId
          : ""
        : "",
      PenerimaManfaatId: null,
      pengusul: "",
      status: null,
      tahunSurat: null,
      tahunUsulan: null,
      jenisData: null,
      ProvinsiId: "",
      CityId: null,
      KecamatanId: null,
      DesaId: null,
      noUsulan: "",
      Perusahaan_name: "",
      namaPerumahan: "",
    },
  });
  const provinsiId = watch("ProvinsiId");
  const kabupatenId = watch("CityId");
  const kecamatanId = watch("KecamatanId");
  const DirektoratId = watch("DirektoratId");
  // ** query
  const queryProvinsi = useProvinsiQuery({}, { skip: !open });
  const queryKabupaten = useKabupatenQuery(provinsiId, {
    skip:
      !provinsiId ||
      provinsiId === "" ||
      !open ||
      userScopeRole === SELECTED_PROVINCE_SCOPE_REGION_ROLE__ID,
  });
  const queryKecamatan = useKecamatanQuery(kabupatenId, {
    skip: !kabupatenId || kabupatenId === "" || !open,
  });
  const queryDesa = useDesaQuery(kecamatanId, {
    skip: !kecamatanId || kecamatanId === "" || !open,
  });
  const queryPenerimaManfaat = usePenerimaManfaatQuery(
    {
      DirektoratId,
      page: 1,
      withLimit: false,
    },
    { skip: !open }
  );
  const queryFilterTahunUsulan = useFilterTahunUsulanQuery({}, { skip: !open });

  useEffect(() => {
    let jenisUsulan = [];
    if (userDirektoratId === ALL_DIREKTORAT_ID) {
      jenisUsulan = [
        OPTION_ALL,
        ...TIPE_USULAN.map((item) => ({
          value: item.direktorat,
          label: item.name,
        })),
      ];
    } else {
      jenisUsulan = [
        OPTION_ALL,
        ...TIPE_USULAN.filter(
          (item) => item.direktorat === userDirektoratId
        ).map((item) => ({
          value: item.direktorat,
          label: item.name,
        })),
      ];
    }

    setOptions((prev) => ({
      ...prev,
      jenisUsulan,
    }));
  }, [userDirektoratId]);

  useEffect(() => {
    if (DirektoratId < 4) {
      setOptions((val) => ({
        ...val,
        jenisData: [
          OPTION_ALL,
          ...JENIS_DATA_USULAN.non_ruk.map((item) => ({
            ...item,
            value: `${item.value}`,
          })),
        ],
      }));
    } else if (DirektoratId === 4) {
      setOptions((val) => ({
        ...val,
        jenisData: [
          OPTION_ALL,
          ...JENIS_DATA_USULAN.ruk
            .filter((item) => item.create)
            .map((item) => ({
              ...item,
              value: `${item.value}`,
            })),
        ],
      }));
    } else {
      setOptions((val) => ({
        ...val,
        jenisData: [OPTION_ALL],
      }));
    }
  }, [DirektoratId]);

  const onSubmit = (data) => {
    console.log(data);
    const filtered = [];
    const convertKey = (key) => {
      return key?.split("_").join(".");
    };

    for (const key of Object.keys(data || {})) {
      if (data?.[key]) {
        if (key === "status") {
          if (data?.[key] === "terkirim") {
            filtered.push({
              id: "in$statusTerkirim",
              value: ["terkirim"],
            });
          } else {
            filtered.push({
              id: convertKey(key),
              value: data?.[key],
            });
          }
        } else {
          filtered.push({
            id: convertKey(key),
            value: data?.[key],
          });
        }
      }
    }

    console.log("filtered", filtered);

    handleTableAttrChange({
      filtered: filtered.length ? filtered : null,
      page: 1,
    });
  };

  // controlled select options
  const userProvinceRegion =
    userRegion && JSON.parse(userRegion).provinsi
      ? JSON.parse(userRegion).provinsi
      : [];
  const optionsProvinsi =
    userScopeRole === SELECTED_PROVINCE_SCOPE_REGION_ROLE__ID
      ? [OPTION_ALL, ...userProvinceRegion]
      : [
          OPTION_ALL,
          ...(queryProvinsi?.data?.map((item) => ({
            value: item.id,
            label: item.nama,
          })) || []),
        ];

  const optionsKabupaten = !provinsiId
    ? [OPTION_ALL]
    : [
        OPTION_ALL,
        ...(queryKabupaten?.data?.map((item) => ({
          value: item.id,
          label: item.nama,
        })) || []),
      ];
  const optionsKecamatan = !kabupatenId
    ? [OPTION_ALL]
    : [
        OPTION_ALL,
        ...(queryKecamatan?.data?.map((item) => ({
          value: item.id,
          label: item.nama,
        })) || []),
      ];
  const optionsDesa = !kecamatanId
    ? [OPTION_ALL]
    : [
        OPTION_ALL,
        ...(queryDesa?.data?.map((item) => ({
          value: item.id,
          label: item.nama,
        })) || []),
      ];
  const optionsPenerimaManfaat = [
    OPTION_ALL,
    ...(queryPenerimaManfaat?.data?.map((item) => ({
      value: item.id,
      label: item.tipe,
    })) || []),
  ];
  const optionsFilterTahunUsulan = [
    OPTION_ALL,
    ...(queryFilterTahunUsulan?.data?.tahunUsulan?.map((item) => ({
      value: item,
      label: item,
    })) || []),
  ];
  const optionsFilterTahunSurat = [
    OPTION_ALL,
    ...(queryFilterTahunUsulan?.data?.tahunSurat?.map((item) => ({
      value: item,
      label: item,
    })) || []),
  ];
  const optionsStatus = [
    // { label: "Terkirim", value: "terkirim" },
    { label: "Vermin", value: "vermin" },
    { label: "Vertek", value: "vertek" },
    { label: "Penetapan", value: "penetapan" },
    { label: "Capaian Pembangunan", value: "pembangunan" },
    { label: "Serah Terima", value: "serah-terima" },
  ];

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
          <Form
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: "0 1rem 1rem" }}
          >
            <Row>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="DirektoratId">
                      Tipe Pengusulan
                    </Label>
                    <Controller
                      name="DirektoratId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="DirektoratId"
                          value={
                            options.jenisUsulan.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={options.jenisUsulan}
                          placeholder="Silahkan pilih tipe pengusulan..."
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
                          isDisabled={
                            loading || userDirektoratId !== ALL_DIREKTORAT_ID
                          }
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="PenerimaManfaatId">
                      Penerima Manfaat
                    </Label>
                    <Controller
                      name="PenerimaManfaatId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="PenerimaManfaatId"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          placeholder="Silahkan pilih penerima manfaat..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          value={
                            optionsPenerimaManfaat?.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={optionsPenerimaManfaat}
                          isLoading={queryPenerimaManfaat?.isLoading || false}
                          isDisabled={loading}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="pengusul">
                      User Pengusul
                    </Label>
                    <Controller
                      control={control}
                      name="pengusul"
                      render={({ field }) => (
                        <Input
                          id="pengusul"
                          {...field}
                          placeholder="Cari user pengusul..."
                          disabled={loading}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="status">
                      Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="status"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          placeholder="Silahkan pilih status..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          value={
                            optionsStatus.find((c) => c.value === value) || ""
                          }
                          options={optionsStatus}
                          isDisabled={loading}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="tahunSuratUsulan">
                      Tahun Surat
                    </Label>
                    <Controller
                      name="tahunSuratUsulan"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="tahunSuratUsulan"
                          value={
                            optionsFilterTahunSurat.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={optionsFilterTahunSurat}
                          placeholder="Silahkan pilih tahun surat..."
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
                          isDisabled={loading}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="tahunUsulan">
                      Tahun Anggaran
                    </Label>
                    <Controller
                      control={control}
                      name="tahunUsulan"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="tahunUsulan"
                          value={
                            optionsFilterTahunUsulan.find(
                              (c) => c.value === value
                            ) || ""
                          }
                          options={optionsFilterTahunUsulan}
                          placeholder="Silahkan pilih tahun anggaran..."
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
                          isDisabled={loading}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="jenisData">
                      Jenis Pengusulan
                    </Label>
                    <Controller
                      control={control}
                      name="jenisData"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="jenisData"
                          value={
                            options.jenisData.find((c) => c.value === value) ||
                            ""
                          }
                          options={options.jenisData}
                          placeholder="Silahkan pilih jenis pengusulan..."
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
                          isDisabled={loading}
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
                      name="ProvinsiId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="ProvinsiId"
                          value={
                            optionsProvinsi?.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsProvinsi}
                          placeholder="Silahkan pilih provinsi..."
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
                          isDisabled={loading}
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
                      name="CityId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          inputId="CityId"
                          value={
                            optionsKabupaten.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKabupaten}
                          placeholder="Silahkan pilih kabupaten..."
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
                          isDisabled={loading}
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
                      name="KecamatanId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          inputId="KecamatanId"
                          value={
                            optionsKecamatan.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKecamatan}
                          placeholder="Silahkan pilih kecamatan..."
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
                          isDisabled={loading}
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
                      name="DesaId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          inputId="DesaId"
                          value={
                            optionsDesa.find((c) => c.value === value) || ""
                          }
                          options={optionsDesa}
                          placeholder="Silahkan pilih desa..."
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
                          isDisabled={loading}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row className="mb-1">
              <Col md="4" className="mb-1">
                <Label className="form-label" for="noUsulan">
                  Nomor Pengusulan
                </Label>
                <Controller
                  name="noUsulan"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="noUsulan"
                      {...field}
                      placeholder="Masukan nomor pengusulan..."
                      disabled={loading}
                    />
                  )}
                />
              </Col>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="Perusahaan_name">
                  Nama Perusahaan
                </Label>
                <Controller
                  name="Perusahaan_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="Perusahaan_name"
                      {...field}
                      placeholder="Masukan nama perusahaan..."
                      disabled={loading}
                    />
                  )}
                />
              </Col>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="namaPerumahan">
                  Nama Perumahan
                </Label>
                <Controller
                  name="namaPerumahan"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="namaPerumahan"
                      {...field}
                      placeholder="Masukan nama perumahan..."
                      disabled={loading}
                    />
                  )}
                />
              </Col>
            </Row>
            <div className="filter-actions">
              <Button
                color="secondary"
                outline
                onClick={() => {
                  reset();
                  handleTableAttrChange({ filtered: null });
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : <Search size={16} />}
                Cari Pengusulan
              </Button>
            </div>
          </Form>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;
