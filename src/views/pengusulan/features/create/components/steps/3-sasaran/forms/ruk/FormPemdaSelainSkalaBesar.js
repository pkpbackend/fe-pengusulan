// ** React Imports
import { useEffect, useRef } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { formSchemaPemdaSelainSkalaBesar } from "./schema";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import LeafletMaps from "../../components/LeafletMaps";

import {
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
  useDesaQuery,
} from "@globalapi/wilayah";

// ** Third Party Components
import {
  useForm,
  Controller,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import Select from "react-select"; // eslint-disable-line
import { ArrowLeft, ArrowRight, Plus } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import Cleave from "cleave.js/react";
import classnames from "classnames";
import { useIsVisible } from "react-is-visible";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import FormBentukBantuan from "./child/FormBentukBantuan";

const FormPemdaSelainSkalaBesar = (props) => {
  const nodeRef = useRef();
  const isVisible = useIsVisible(nodeRef);
  // ** props
  const {
    stepper,
    form: { formData, setFormData },
  } = props;

  // ** Hooks
  const forms = useForm({
    defaultValues: {
      namaPerumahan: formData?.namaPerumahan || "",
      alamatPerumahan: formData?.alamatPerumahan || "",
      namaKelompokMbr: formData?.namaKelompokMbr || "",

      provinsi: formData?.provinsi || "",
      kabupaten: formData?.kabupaten || "",
      kecamatan: formData?.kecamatan || "",
      desa: formData?.desa || "",
      longitude: formData?.longitude || "",
      latitude: formData?.latitude || "",

      dayaTampung: formData?.dayaTampung || 0,
      jumlahUsulan: formData?.jumlahUsulan || 0,
      bentukBantuan: formData?.bentukBantuan || [],
    },
    resolver: yupResolver(formSchemaPemdaSelainSkalaBesar),
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
      if (type === "change" && name === "provinsi") {
        setValue("kabupaten", "0", { shouldDirty: true });
        setValue("kecamatan", "0", { shouldDirty: true });
        setValue("desa", "0", { shouldDirty: true });
      }
      if (type === "change" && name === "kabupaten") {
        if (value.kabupaten !== "0" && value.kabupaten !== "") {
          const kabupaten =
            queryKabupaten.data?.find((c) => c.id === value.kabupaten) || null;

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

  return (
    <FormProvider {...forms}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h5>Data Perumahan Selain Skala Besar</h5>
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
            <Label className="form-label" for="namaKelompokMbr">
              Nama Kelompok MBR
            </Label>
            <Controller
              id="namaKelompokMbr"
              name="namaKelompokMbr"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="cth: Kelompok A"
                  invalid={errors.namaKelompokMbr && true}
                  {...field}
                />
              )}
            />
            {errors.namaKelompokMbr && (
              <FormFeedback>{errors.namaKelompokMbr.message}</FormFeedback>
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
        <hr></hr>
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
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nama}
                    value={
                      queryProvinsi?.data?.find((c) => c.id === value) || ""
                    }
                    options={queryProvinsi?.data || []}
                    isLoading={queryProvinsi?.isLoading || false}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="kabupaten">
              Kabupaten/Kota
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
                    isLoading={queryKecamatan.isLoading || false}
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
          <div ref={nodeRef}>
            {kabupatenId !== "" && kabupatenId !== "0" && (
              <>
                {isVisible && (
                  <Row>
                    <Col
                      md="6"
                      className="mb-1"
                      style={{ marginTop: "0.5rem" }}
                    >
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
                            <FormFeedback>
                              {errors.latitude.message}
                            </FormFeedback>
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
                            <FormFeedback>
                              {errors.longitude.message}
                            </FormFeedback>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </div>
        </Row>
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
                    min={0}
                  />
                </CustomInputWrapper>
              )}
            />
            {errors.dayaTampung && (
              <FormFeedback>{errors.dayaTampung.message}</FormFeedback>
            )}
          </Col>
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
                    min={0}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>

        <hr></hr>
        <Row className="mb-4">
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
export default FormPemdaSelainSkalaBesar;
