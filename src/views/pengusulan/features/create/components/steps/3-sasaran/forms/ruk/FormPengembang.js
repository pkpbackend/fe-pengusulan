import { useEffect } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { formSchemaPengembang } from "./schema";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import {
  useDesaQuery,
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
} from "@globalapi/wilayah";

import LeafletMaps from "../../components/LeafletMaps";

// ** Third Party Components
import {
  useForm,
  Controller,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import Select from "react-select"; // eslint-disable-line
import { ArrowLeft, ArrowRight, Plus } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import Cleave from "cleave.js/react";
import classnames from "classnames";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
  FormText,
} from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import FormBentukBantuan from "./child/FormBentukBantuan";

const setPercentValue = (value, name, setValue) => {
  let percent = 0;

  if (value.dayaTampung > 0) {
    if (value[name] > 0) {
      percent = (value[name] / value.dayaTampung) * 100;
    }
  }

  setValue(`${name}Persentase`, Number(percent).toFixed(2).toLocaleString(), {
    shouldDirty: true,
  });
};

const FormPengembang = (props) => {
  // ** props
  const {
    stepper,
    form: { formData, setFormData },
  } = props;

  const isScalaBesar = formData?.type?.value === 7;

  // ** Hooks
  const forms = useForm({
    defaultValues: {
      namaPerumahan: formData.namaPerumahan || "",
      alamatPerumahan: formData.alamatPerumahan || "",
      provinsi: formData.provinsi || "",
      kabupaten: formData.kabupaten || "",
      kecamatan: formData.kecamatan || "",
      desa: formData.desa || "",
      latitude: formData.latitude || "",
      longitude: formData.longitude || "",

      dayaTampung: formData.dayaTampung || 0,
      ...(isScalaBesar
        ? {
            jmlRumahUmum: formData.jmlRumahUmum || 0,
            jmlRumahMenengah: formData.jmlRumahMenengah || 0,
            jmlRumahMewah: formData.jmlRumahMewah || 0,
            jmlRumahUmumPersentase: formData.jmlRumahUmumPersentase || 0,
            jmlRumahMenengahPersentase:
              formData.jmlRumahMenengahPersentase || 0,
            jmlRumahMewahPersentase: formData.jmlRumahMewahPersentase || 0,

            jmlRumahUmumTerbangun: formData.jmlRumahUmumTerbangun || 0,
            jmlRumahMenengahTerbangun: formData.jmlRumahMenengahTerbangun || 0,
            jmlRumahMewahTerbangun: formData.jmlRumahMewahTerbangun || 0,
            jmlRumahUmumTerbangunPersentase:
              formData.jmlRumahUmumTerbangunPersentase,
            jmlRumahMenengahTerbangunPersentase:
              formData.jmlRumahMenengahTerbangunPersentase,
            jmlRumahMewahTerbangunPersentase:
              formData.jmlRumahMewahTerbangunPersentase,
          }
        : {}),
      jumlahUsulan: formData.jumlahUsulan || 0,

      bentukBantuan: formData.bentukBantuan || [],
      dokumenSbu: formData?.id ? formData.dokumenSbu ?? 0 : 0,
      fileDokumenSbu: formData?.id ? formData.fileDokumenSbu : "",
      isNewSbu: false,
    },
    resolver: yupResolver(formSchemaPengembang(isScalaBesar)),
  });
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = forms;

  const bentukBantuanArray = useFieldArray({
    control,
    name: "bentukBantuan",
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const provinsiId = watch("provinsi");
  const kabupatenId = watch("kabupaten");
  const kecamatanId = watch("kecamatan");
  const dokumenSbu = watch("dokumenSbu");
  const fileDokumenSbu = watch(
    "fileDokumenSbu",
    formData?.id ? formData.fileDokumenSbu?.name : ""
  );

  // ** query
  const queryProvinsi = useProvinsiQuery();
  const queryKabupaten = useKabupatenQuery(provinsiId, {
    skip: !provinsiId || provinsiId === "0",
  });
  const queryKecamatan = useKecamatanQuery(kabupatenId, {
    skip: !kabupatenId || kabupatenId === "0",
  });
  const queryDesa = useDesaQuery(kecamatanId, {
    skip: !kecamatanId || kecamatanId === "0",
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (
        type === "change" &&
        (name === "dayaTampung" ||
          name === "jmlRumahUmum" ||
          name === "jmlRumahMenengah" ||
          name === "jmlRumahMewah" ||
          name === "jmlRumahUmumTerbangun" ||
          name === "jmlRumahMenengahTerbangun" ||
          name === "jmlRumahMewahTerbangun")
      ) {
        setPercentValue(value, "jmlRumahUmum", setValue);
        setPercentValue(value, "jmlRumahMenengah", setValue);
        setPercentValue(value, "jmlRumahMewah", setValue);
        setPercentValue(value, "jmlRumahUmumTerbangun", setValue);
        setPercentValue(value, "jmlRumahMenengahTerbangun", setValue);
        setPercentValue(value, "jmlRumahMewahTerbangun", setValue);

        if (
          name === "jmlRumahUmum" ||
          name === "jmlRumahMenengah" ||
          name === "jmlRumahMewah"
        ) {
          setValue(
            "dayaTampung",
            Number(value.jmlRumahUmum) +
              Number(value.jmlRumahMenengah) +
              Number(value.jmlRumahMewah),
            { shouldDirty: true, shouldValidate: true }
          );
        }
      }

      if (type === "change" && name === "provinsi") {
        setValue("kabupaten", "0", { shouldDirty: true });
        setValue("kecamatan", "0", { shouldDirty: true });
        setValue("desa", "0", { shouldDirty: true });
      }
      if (type === "change" && name === "kabupaten") {
        if (value.kabupaten !== "") {
          const kabupaten =
            queryKabupaten?.data?.find((c) => c.id === value.kabupaten) || null;

          setValue("latitude", kabupaten?.latitude || "", {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("longitude", kabupaten?.longitude || "", {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        setValue("kecamatan", "0", { shouldDirty: true });
        setValue("desa", "0", { shouldDirty: true });
      }
      if (type === "change" && name === "kecamatan") {
        setValue("desa", "0", { shouldDirty: true });
      }

      if (type === "change" && name === "kecamatan") {
        setValue("desa", "0", { shouldDirty: true });
      }

      if (type === "change" && name === "fileDokumenSbu") {
        setValue("isNewSbu", true, { shouldDirty: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, queryKabupaten.data, setValue]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
        provinsi: queryProvinsi?.data?.find(
          (c) => c.id === Number(data.provinsi)
        ),
        kabupaten: queryKabupaten?.data?.find(
          (c) => c.id === Number(data.kabupaten)
        ),
        kecamatan: queryKecamatan?.data?.find(
          (c) => c.id === Number(data.kecamatan)
        ),
        desa: queryDesa?.data?.find((c) => c.id === Number(data.desa)),
      }));
      stepper.next();
    }
  };

  // console.log("formData", formData, fileDokumenSbu, formData.fileDokumenSbu);

  return (
    <FormProvider {...forms}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h5>Data Perumahan</h5>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="namaPerumahan">
              Nama
            </Label>
            <Controller
              id="namaPerumahan"
              name="namaPerumahan"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="cth: Perumahan X"
                  invalid={errors.namaPerumahan && true}
                  {...field}
                />
              )}
            />
            {errors.namaPerumahan && (
              <FormFeedback>{errors.namaPerumahan.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="alamatPerumahan">
              Alamat
            </Label>
            <Controller
              id="alamatPerumahan"
              name="alamatPerumahan"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="cth: Jl x"
                  invalid={errors.alamatPerumahan && true}
                  {...field}
                />
              )}
            />
            {errors.alamatPerumahan && (
              <FormFeedback>{errors.alamatPerumahan.message}</FormFeedback>
            )}
          </Col>
        </Row>
        {/* wilayah perumahan */}
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="provinsi">
              Provinsi
            </Label>
            <Controller
              id="provinsi"
              name="provinsi"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.provinsi}>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPlacement="auto"
                    placeholder="Silahkan pilih provinsi..."
                    className={classnames("react-select", {
                      "is-invalid": errors.provinsi,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.id);
                    }}
                    value={
                      queryProvinsi?.data?.find(
                        (provinsi) => provinsi.id === value
                      ) || ""
                    }
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nama}
                    options={queryProvinsi?.data || []}
                    isLoading={queryProvinsi?.isLoading || false}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="kabupaten">
              Kabupaten
            </Label>
            <Controller
              id="kabupaten"
              name="kabupaten"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.kabupaten}>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPlacement="auto"
                    placeholder="Silahkan pilih kabupaten..."
                    className={classnames("react-select", {
                      "is-invalid": errors.kabupaten,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.id);
                    }}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nama}
                    value={
                      queryKabupaten?.data?.find((c) => c.id === value) || ""
                    }
                    options={queryKabupaten?.data || []}
                    isLoading={queryKabupaten?.isLoading || false}
                    isDisabled={!provinsiId || provinsiId === "0"}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="kecamatan">
              Kecamatan
            </Label>
            <Controller
              id="kecamatan"
              name="kecamatan"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.kecamatan}>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPlacement="auto"
                    placeholder="Silahkan pilih kecamatan..."
                    className={classnames("react-select", {
                      "is-invalid": errors.kecamatan,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.id);
                    }}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nama}
                    value={
                      queryKecamatan?.data?.find((c) => c.id === value) || ""
                    }
                    options={queryKecamatan?.data || []}
                    isLoading={queryKecamatan?.isLoading || false}
                    isDisabled={!kabupatenId || kabupatenId === "0"}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="desa">
              Desa/Kelurahan
            </Label>
            <Controller
              id="desa"
              name="desa"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.desa}>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPlacement="auto"
                    placeholder="Silahkan pilih desa..."
                    className={classnames("react-select", {
                      "is-invalid": errors.desa,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.id);
                    }}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nama}
                    value={queryDesa?.data?.find((c) => c.id === value) || ""}
                    options={queryDesa?.data || []}
                    isLoading={queryDesa?.isLoading || false}
                    isDisabled={!kecamatanId || kecamatanId === "0"}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>
        {kabupatenId && (
          <>
            <hr></hr>
            <Row>
              <Col md="6" className="mb-1">
                <LeafletMaps
                  latitude={parseFloat(latitude)}
                  longitude={parseFloat(longitude)}
                  onDragEnd={(marker) => {
                    if (marker !== null) {
                      setValue("latitude", marker.getLatLng().lat, {
                        shouldDirty: true,
                      });
                      setValue("longitude", marker.getLatLng().lng, {
                        shouldDirty: true,
                      });
                    } else {
                      setValue("latitude", "", { shouldDirty: true });
                      setValue("longitude", "", { shouldDirty: true });
                    }
                  }}
                />
              </Col>
              <Col md="6" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="latitude">
                      Koordinat Latitude (Y)
                    </Label>
                    <Controller
                      id="latitude"
                      name="latitude"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="cth: -8.670458"
                          invalid={errors.latitude && true}
                          {...field}
                        />
                      )}
                    />
                    {errors.latitude && (
                      <FormFeedback>{errors.latitude.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="longitude">
                      Koordinat Longitude (X)
                    </Label>
                    <Controller
                      id="longitude"
                      name="longitude"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="cth: 115.212631"
                          invalid={errors.longitude && true}
                          {...field}
                        />
                      )}
                    />
                    {errors.longitude && (
                      <FormFeedback>{errors.longitude.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
        <hr></hr>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="dayaTampung">
              Daya Tampung Keseluruhan (dalam Unit)
            </Label>
            <Controller
              id="dayaTampung"
              name="dayaTampung"
              control={control}
              render={({ field }) => (
                <CustomInputWrapper error={errors.dayaTampung}>
                  <Cleave
                    className={classnames("form-control", {
                      "is-invalid": errors.dayaTampung,
                    })}
                    placeholder="0"
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.rawValue);
                    }}
                    value={field.value}
                  />
                </CustomInputWrapper>
              )}
            />
            {errors.dayaTampung && (
              <FormFeedback>{errors.dayaTampung.message}</FormFeedback>
            )}
          </Col>
        </Row>
        {isScalaBesar ? (
          <>
            <hr></hr>
            <Row>
              <h5>Proporsi Jumlah Rumah (dalam keseluruhan daya tampung)</h5>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="jmlRumahUmum">
                  Jumlah Rumah Umum
                </Label>
                <Row>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahUmum"
                      name="jmlRumahUmum"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper error={errors.jmlRumahUmum}>
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahUmum,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahUmum,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahUmum && (
                      <FormFeedback>{errors.jmlRumahUmum.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahUmumPersentase"
                      name="jmlRumahUmumPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup>
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="jmlRumahMenengah">
                  Jumlah Rumah Menengah
                </Label>
                <Row>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahMenengah"
                      name="jmlRumahMenengah"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper error={errors.jmlRumahMenengah}>
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahMenengah,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahMenengah,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                              min={0}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahMenengah && (
                      <FormFeedback>
                        {errors.jmlRumahMenengah.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahMenengahPersentase"
                      name="jmlRumahMenengahPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup>
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="jmlRumahMewah">
                  Jumlah Rumah Mewah
                </Label>
                <Row>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahMewah"
                      name="jmlRumahMewah"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper error={errors.jmlRumahMewah}>
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahMewah,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahMewah,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                              min={0}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahMewah && (
                      <FormFeedback>
                        {errors.jmlRumahMewah.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahMewahPersentase"
                      name="jmlRumahMewahPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup>
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <h5>Jumlah Rumah Terbangun</h5>
              <Col md="4">
                <Label className="form-label" for="jmlRumahUmumTerbangun">
                  Jumlah Rumah Umum
                </Label>
                <Row>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahUmumTerbangun"
                      name="jmlRumahUmumTerbangun"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper
                          error={errors.jmlRumahUmumTerbangun}
                        >
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahUmumTerbangun,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahUmumTerbangun,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                              min={0}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahUmumTerbangun && (
                      <FormFeedback>
                        {errors.jmlRumahUmumTerbangun.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Controller
                      id="jmlRumahUmumTerbangunPersentase"
                      name="jmlRumahUmumTerbangunPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup className="mb-2">
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4">
                <Label className="form-label" for="jmlRumahMenengahTerbangun">
                  Jumlah Rumah Menengah
                </Label>
                <Row>
                  <Col md="6" className="mb-0">
                    <Controller
                      id="jmlRumahMenengahTerbangun"
                      name="jmlRumahMenengahTerbangun"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper
                          error={errors.jmlRumahMenengahTerbangun}
                        >
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahMenengahTerbangun,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahMenengahTerbangun,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                              min={0}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahMenengahTerbangun && (
                      <FormFeedback>
                        {errors.jmlRumahMenengahTerbangun.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-0">
                    <Controller
                      id="jmlRumahMenengahTerbangunPersentase"
                      name="jmlRumahMenengahTerbangunPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup className="mb-2">
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="4">
                <Label className="form-label" for="jmlRumahMewahTerbangun">
                  Jumlah Rumah Mewah
                </Label>
                <Row>
                  <Col md="6" className="mb-0">
                    <Controller
                      id="jmlRumahMewahTerbangun"
                      name="jmlRumahMewahTerbangun"
                      control={control}
                      render={({ field }) => (
                        <CustomInputWrapper
                          error={errors.jmlRumahMewahTerbangun}
                        >
                          <InputGroup
                            className={classnames({
                              "is-invalid": errors.jmlRumahMewahTerbangun,
                            })}
                          >
                            <Cleave
                              className={classnames("form-control", {
                                "is-invalid": errors.jmlRumahMewahTerbangun,
                              })}
                              placeholder="0"
                              options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                              }}
                              onChange={(e) => {
                                field.onChange(e.target.rawValue);
                              }}
                              value={field.value}
                            />
                            <InputGroupText>Unit</InputGroupText>
                          </InputGroup>
                        </CustomInputWrapper>
                      )}
                    />
                    {errors.jmlRumahMewahTerbangun && (
                      <FormFeedback>
                        {errors.jmlRumahMewahTerbangun.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-0">
                    <Controller
                      id="jmlRumahMewahTerbangunPersentase"
                      name="jmlRumahMewahTerbangunPersentase"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup className="mb-2">
                            <Input {...field} readOnly />
                            <InputGroupText>%</InputGroupText>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}

        <hr></hr>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="jumlahUsulan">
              Jumlah Usulan (dalam unit)
            </Label>
            <Controller
              id="jumlahUsulan"
              name="jumlahUsulan"
              control={control}
              render={({ field }) => (
                <CustomInputWrapper error={errors.jumlahUsulan}>
                  <Cleave
                    className={classnames("form-control", {
                      "is-invalid": errors.jumlahUsulan,
                    })}
                    placeholder="0"
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.rawValue);
                    }}
                    value={field.value}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>
        <hr></hr>
        <Row className="mb-1">
          <Col md="12">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5 className="mb-0">Bentuk Bantuan</h5>
                {errors.bentukBantuan &&
                  !Array.isArray(errors.bentukBantuan) && (
                    <span className="text-danger">
                      {errors.bentukBantuan.message}
                    </span>
                  )}
              </div>

              <Button
                color="primary"
                size="md"
                className="btn-next"
                onClick={() => {
                  bentukBantuanArray.append({
                    bantuan: "",
                  });
                }}
                disabled={bentukBantuanArray.fields.length > 3}
              >
                <Plus size={14} className="align-middle ms-sm-25 me-0"></Plus>
                <span className="align-middle d-sm-inline-block d-none">
                  Tambah Bentuk Bantuan
                </span>
              </Button>
            </div>
            {bentukBantuanArray.fields.length > 0 ? null : <hr></hr>}
          </Col>
          <Col md="12">
            <Row>
              {bentukBantuanArray.fields.map((field, index) => {
                return (
                  <div key={index}>
                    <FormBentukBantuan
                      index={index}
                      field={field}
                      options={[
                        {
                          value: "Jalan Lingkungan",
                          label: "Jalan Lingkungan",
                        },
                        {
                          value: "Drainase",
                          label: "Drainase",
                        },
                        {
                          value: "Sistem Penyediaan Air Minum",
                          label: "Sistem Penyediaan Air Minum",
                        },
                        {
                          value: "Sarana dan Prasarana Persampahan",
                          label: "Sarana dan Prasarana Persampahan",
                        },
                      ]}
                      formData={formData}
                      hookForm={{
                        remove: bentukBantuanArray.remove,
                      }}
                    />
                  </div>
                );
              })}
            </Row>
          </Col>
        </Row>
        {bentukBantuanArray.fields.length > 0 ? <hr></hr> : null}
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="dokumenSbu">
              Apakah Pelaku Pembangunan sudah memiliki dokumen SBU?
            </Label>
            <Controller
              id="dokumenSbu"
              name="dokumenSbu"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.dokumenSbu}>
                  <Select
                    options={[
                      {
                        value: 0,
                        label: "Tidak",
                      },
                      {
                        value: 1,
                        label: "Ya",
                      },
                    ]}
                    placeholder="Silahkan pilih ketersediaan dokumen SBU..."
                    className={classnames("react-select", {
                      "is-invalid": errors.dokumenSbu,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.value);
                    }}
                    value={
                      value
                        ? {
                            value: 1,
                            label: "Ya",
                          }
                        : {
                            value: 0,
                            label: "Tidak",
                          }
                    }
                    menuPlacement="auto"
                  />
                </CustomInputWrapper>
              )}
            />
            {errors.dokumenSbu && (
              <FormFeedback>{errors.dokumenSbu.message}</FormFeedback>
            )}
          </Col>
          {dokumenSbu === 1 && (
            <Col md="6" className="mb-1">
              <Label className="form-label" for="fileDokumenSbu">
                Upload Dokumen SBU
              </Label>
              <Controller
                id="fileDokumenSbu"
                name="fileDokumenSbu"
                control={control}
                render={({ field: { onChange, name: fName } }) => (
                  <CustomInputWrapper error={errors.fileDokumenSbu}>
                    <Input
                      type="file"
                      name={fName}
                      onChange={(e) => {
                        onChange(e.target.files[0]);
                      }}
                    />
                  </CustomInputWrapper>
                )}
              />
              {fileDokumenSbu && (
                <FormText className="text-muted">
                  Filename: {fileDokumenSbu?.name ?? fileDokumenSbu ?? ""}
                </FormText>
              )}
              {errors.fileDokumenSbu && (
                <FormFeedback>{errors.fileDokumenSbu.message}</FormFeedback>
              )}
            </Col>
          )}
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            color="secondary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Sebelumnya
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              Selanjutnya
            </span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};
export default FormPengembang;
