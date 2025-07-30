import { useEffect } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { formSchemaPemdaSkalaBesar } from "./schema";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import FormLokasi from "./child/FormLokasi";

import {
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
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
import _ from "lodash";

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
} from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import FormPerumahan from "./child/FormPerumahan";
import FormBentukBantuan from "./child/FormBentukBantuan";

const setTotalDayaTampung = (values, setValue) => {
  const { perumahan } = values;

  let dayaTampung = 0;
  let jmlRumahMewah = 0;
  let jmlRumahMenengah = 0;
  let jmlRumahUmum = 0;

  // calculate totals
  for (const rumah of perumahan) {
    jmlRumahMewah += Number(rumah.jmlRumahMewah);
    jmlRumahMenengah += Number(rumah.jmlRumahMenengah);
    jmlRumahUmum += Number(rumah.jmlRumahUmum);
  }

  dayaTampung = jmlRumahMewah + jmlRumahMenengah + jmlRumahUmum;
  // total daya tampung
  setValue(`dayaTampung`, Number(dayaTampung), {
    shouldDirty: true,
  });

  // total jumlah usulan
  setValue(`jmlRumahMewah`, Number(jmlRumahMewah), {
    shouldDirty: true,
  });
  setValue(`jmlRumahMenengah`, Number(jmlRumahMenengah), {
    shouldDirty: true,
  });
  setValue(`jmlRumahUmum`, Number(jmlRumahUmum), {
    shouldDirty: true,
  });

  if (dayaTampung > 0) {
    setValue(
      `jmlRumahMewahPersentase`,
      Number(jmlRumahMewah > 0 ? (jmlRumahMewah / dayaTampung) * 100 : 0)
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
    setValue(
      `jmlRumahMenengahPersentase`,
      Number(jmlRumahMenengah > 0 ? (jmlRumahMenengah / dayaTampung) * 100 : 0)
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
    setValue(
      `jmlRumahUmumPersentase`,
      Number(jmlRumahUmum > 0 ? (jmlRumahUmum / dayaTampung) * 100 : 0)
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
  }

  for (let i = 0; i < perumahan.length; i++) {
    setValue(
      `perumahan.${i}.jmlRumahMewahPersentase`,
      Number(
        _.get(values, `perumahan.[${i}].jmlRumahMewah`) > 0
          ? (_.get(values, `perumahan.[${i}].jmlRumahMewah`) / dayaTampung) *
              100
          : 0
      )
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
    setValue(
      `perumahan.${i}.jmlRumahMenengahPersentase`,
      Number(
        _.get(values, `perumahan.[${i}].jmlRumahMenengah`) > 0
          ? (_.get(values, `perumahan.[${i}].jmlRumahMenengah`) / dayaTampung) *
              100
          : 0
      )
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
    setValue(
      `perumahan.${i}.jmlRumahUmumPersentase`,
      Number(
        _.get(values, `perumahan.[${i}].jmlRumahUmum`) > 0
          ? (_.get(values, `perumahan.[${i}].jmlRumahUmum`) / dayaTampung) * 100
          : 0
      )
        .toFixed(2)
        .toLocaleString(),
      {
        shouldDirty: true,
      }
    );
  }
};

const setPercentValueTerbangun = (values, name, setValue) => {
  let percent = 0;

  if (values.dayaTampung > 0) {
    if (values[name] > 0) {
      percent = (values[name] / values.dayaTampung) * 100;
    }
  }

  setValue(`${name}Persentase`, Number(percent).toFixed(2).toLocaleString(), {
    shouldDirty: true,
  });
};

const FormPemdaSkalaBesar = (props) => {
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
      noSuratKeputusanDaerah: formData?.noSuratKeputusanDaerah || "",
      provinsi: formData?.provinsi || "",
      kabupaten: formData?.kabupaten || "",

      lokasi: formData?.lokasi || [],
      luasanDelinasi: formData?.luasanDelinasi || 0,
      dayaTampung: formData?.dayaTampung || 0,

      jmlRumahUmum: formData?.jmlRumahUmum || 0,
      jmlRumahMenengah: formData?.jmlRumahMenengah || 0,
      jmlRumahMewah: formData?.jmlRumahMewah || 0,
      jmlRumahUmumPersentase: formData.jmlRumahUmumPersentase || 0,
      jmlRumahMenengahPersentase: formData.jmlRumahMenengahPersentase || 0,
      jmlRumahMewahPersentase: formData.jmlRumahMewahPersentase || 0,

      jmlRumahUmumTerbangun: formData?.jmlRumahUmumTerbangun || 0,
      jmlRumahMenengahTerbangun: formData?.jmlRumahMenengahTerbangun || 0,
      jmlRumahMewahTerbangun: formData?.jmlRumahMewahTerbangun || 0,
      jmlRumahUmumTerbangunPersentase: formData.jmlRumahUmumTerbangunPersentase,
      jmlRumahMenengahTerbangunPersentase:
        formData.jmlRumahMenengahTerbangunPersentase,
      jmlRumahMewahTerbangunPersentase:
        formData.jmlRumahMewahTerbangunPersentase,

      jumlahUsulan: formData?.jumlahUsulan || 0,

      perumahan: formData.perumahan || [],

      panjangJalanUsulan: formData?.panjangJalanUsulan || 0,
      lebarJalanUsulan: formData?.lebarJalanUsulan || 0,
      bentukBantuan: formData?.bentukBantuan || [],
      statusJalan: formData?.statusJalan || "",
    },
    resolver: yupResolver(formSchemaPemdaSkalaBesar),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = forms;

  const lokasiArray = useFieldArray({
    control,
    name: "lokasi",
  });
  const perumahanArray = useFieldArray({
    control,
    name: "perumahan",
  });
  const bentukBantuanArray = useFieldArray({
    control,
    name: "bentukBantuan",
  });

  const statusJalan = watch("statusJalan");
  const provinsiId = watch("provinsi");
  const kabupatenId = watch("kabupaten");

  // ** query
  const queryProvinsi = useProvinsiQuery();
  const queryKabupaten = useKabupatenQuery(provinsiId, {
    skip: !provinsiId || provinsiId === "0",
  });
  const queryKecamatan = useKecamatanQuery(kabupatenId, {
    skip: !kabupatenId || kabupatenId === "0",
  });

  useEffect(() => {
    const subscription = watch((values, { name, type }) => {
      if (
        type === "change" &&
        (name === "jmlRumahUmumTerbangun" ||
          name === "jmlRumahMenengahTerbangun" ||
          name === "jmlRumahMewahTerbangun")
      ) {
        setPercentValueTerbangun(values, "jmlRumahUmumTerbangun", setValue);
        setPercentValueTerbangun(values, "jmlRumahMenengahTerbangun", setValue);
        setPercentValueTerbangun(values, "jmlRumahMewahTerbangun", setValue);
      }

      if (type === "change" && name === "kabupaten") {
        lokasiArray.remove();
      }
      if (
        type === "change" &&
        name.includes("perumahan") &&
        name.includes("jml")
      ) {
        setTotalDayaTampung(values, setValue);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
      }));
      stepper.next();
    }
  };
  return (
    <FormProvider {...forms}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h5>Data Perumahan Skala Besar</h5>
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
            <Label className="form-label" for="noSuratKeputusanDaerah">
              No. Surat Keputusan Kepala Daerah
            </Label>
            <Controller
              id="noSuratKeputusanDaerah"
              name="noSuratKeputusanDaerah"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="cth: SK/xxx/xxx"
                  invalid={errors.noSuratKeputusanDaerah && true}
                  {...field}
                />
              )}
            />
            {errors.noSuratKeputusanDaerah && (
              <FormFeedback>
                {errors.noSuratKeputusanDaerah.message}
              </FormFeedback>
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
          <Col md="6" className="mb-1 mb-sm-0">
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
          <Col md="6">
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
                <h5 className="mb-0">Daftar Lokasi</h5>
                {errors.lokasi && !Array.isArray(errors.lokasi) && (
                  <span className="text-danger">{errors.lokasi.message}</span>
                )}
              </div>

              <Button
                color="primary"
                size="md"
                className="btn-next"
                onClick={() => {
                  lokasiArray.append({
                    kecamatan: "",
                    desa: "",
                    latitude: "",
                    longitude: "",
                  });
                }}
              >
                <Plus size={14} className="align-middle ms-sm-25 me-0"></Plus>
                <span className="align-middle d-sm-inline-block d-none">
                  Tambah Lokasi
                </span>
              </Button>
            </div>
          </Col>
          <Col md="12">
            <Row>
              {lokasiArray.fields.map((field, index) => {
                return (
                  <div key={index}>
                    <FormLokasi
                      index={index}
                      field={field}
                      hookForm={{
                        remove: lokasiArray.remove,
                      }}
                      data={{
                        queryKabupaten,
                        queryKecamatan,
                      }}
                    />
                  </div>
                );
              })}
            </Row>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="luasanDelinasi">
              Luasan Deliniasi (dalam Ha)
            </Label>
            <Controller
              id="luasanDelinasi"
              name="luasanDelinasi"
              control={control}
              render={({ field }) => (
                <CustomInputWrapper error={errors.luasanDelinasi}>
                  <Cleave
                    className={classnames("form-control", {
                      "is-invalid": errors.luasanDelinasi,
                    })}
                    placeholder="0"
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand",
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.rawValue);
                    }}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
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
                    readOnly
                  />
                </CustomInputWrapper>
              )}
            />
            {errors.dayaTampung && (
              <FormFeedback>{errors.dayaTampung.message}</FormFeedback>
            )}
          </Col>
        </Row>
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
                          min={0}
                          readOnly
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
                    <InputGroup>
                      <Input {...field} readOnly />
                      <InputGroupText>%</InputGroupText>
                    </InputGroup>
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
                          readOnly
                        />
                        <InputGroupText>Unit</InputGroupText>
                      </InputGroup>
                    </CustomInputWrapper>
                  )}
                />
                {errors.jmlRumahMenengah && (
                  <FormFeedback>{errors.jmlRumahMenengah.message}</FormFeedback>
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
                          readOnly
                        />
                        <InputGroupText>Unit</InputGroupText>
                      </InputGroup>
                    </CustomInputWrapper>
                  )}
                />
                {errors.jmlRumahMewah && (
                  <FormFeedback>{errors.jmlRumahMewah.message}</FormFeedback>
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
                    <CustomInputWrapper error={errors.jmlRumahUmumTerbangun}>
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
                    <CustomInputWrapper error={errors.jmlRumahMewahTerbangun}>
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
                          min={0}
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
        <hr></hr>

        {/* list perumahan */}
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
                <h5 className="mb-0">Daftar Perumahan</h5>
                {errors.perumahan && !Array.isArray(errors.perumahan) && (
                  <span className="text-danger">
                    {errors.perumahan.message}
                  </span>
                )}
              </div>

              <Button
                color="primary"
                size="md"
                className="btn-next"
                onClick={() => {
                  perumahanArray.append({
                    nama: "",
                    jmlRumahUmum: 0,
                    jmlRumahMenengah: 0,
                    jmlRumahMewah: 0,
                  });
                }}
              >
                <Plus size={14} className="align-middle ms-sm-25 me-0"></Plus>
                <span className="align-middle d-sm-inline-block d-none">
                  Tambah Perumahan
                </span>
              </Button>
            </div>
          </Col>
          <Col md="12">
            <Row>
              {perumahanArray.fields.map((field, index) => {
                return (
                  <div key={index}>
                    <FormPerumahan
                      index={index}
                      field={field}
                      hookForm={{
                        remove: perumahanArray.remove,
                      }}
                    />
                  </div>
                );
              })}
            </Row>
          </Col>
        </Row>
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
                    min={0}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>
        <hr></hr>
        <Row>
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
                disabled={bentukBantuanArray.fields.length > 1}
              >
                <Plus size={14} className="align-middle ms-sm-25 me-0"></Plus>
                <span className="align-middle d-sm-inline-block d-none">
                  Tambah Bentuk Bantuan
                </span>
              </Button>
            </div>
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
                          value: "Jalan Penghubung Antar Perumahan",
                          label: "Jalan Penghubung Antar Perumahan",
                        },
                        {
                          value: "Jalan Akses Perumahan Umum",
                          label: "Jalan Akses Perumahan Umum",
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
        <hr></hr>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="panjangJalanUsulan">
              Panjang Jalan Usulan (dalam meter)
            </Label>
            <Controller
              id="panjangJalanUsulan"
              name="panjangJalanUsulan"
              control={control}
              render={({ field }) => (
                <CustomInputWrapper error={errors.panjangJalanUsulan}>
                  <Cleave
                    className={classnames("form-control", {
                      "is-invalid": errors.panjangJalanUsulan,
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
          <Col md="6" className="mb-1">
            <Label className="form-label" for="lebarJalanUsulan">
              Lebar Jalan Usulan (dalam meter)
            </Label>
            <Controller
              id="lebarJalanUsulan"
              name="lebarJalanUsulan"
              control={control}
              render={({ field }) => (
                <CustomInputWrapper error={errors.lebarJalanUsulan}>
                  <Cleave
                    className={classnames("form-control", {
                      "is-invalid": errors.lebarJalanUsulan,
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
          <Col md="6" className="mb-1">
            <Label className="form-label" for="statusJalan">
              Status Jalan
            </Label>
            <Controller
              id="statusJalan"
              name="statusJalan"
              control={control}
              render={({ field: { onChange, value } }) => {
                const options = [
                  {
                    value: "Milik Pemda",
                    label: "Milik Pemda",
                  },
                  {
                    value: "Milik Pelaku Pembangunan",
                    label: "Milik Pelaku Pembangunan",
                  },
                  {
                    value: "Lainnya",
                    label: "Lainnya",
                  },
                ];
                return (
                  <CustomInputWrapper error={errors.statusJalan}>
                    <Select
                      options={options}
                      placeholder="Silahkan pilih status jalan..."
                      className={classnames("react-select", {
                        "is-invalid": errors.statusJalan,
                      })}
                      classNamePrefix="select"
                      onChange={(value) => {
                        onChange(value.value);
                      }}
                      value={options?.find((option) => option.value === value)}
                      menuPlacement="auto"
                    />
                  </CustomInputWrapper>
                );
              }}
            />
          </Col>
          {statusJalan === "Milik Pemda" && (
            <Col md="6" className="mb-1">
              <Label className="form-label" for="detailStatus">
                Keterangan Status
              </Label>
              <Controller
                id="detailStatus"
                name="detailStatus"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const options = [
                    {
                      value: "Belum Berstatus",
                      label: "Belum Berstatus",
                    },
                    {
                      value: "Berstatus",
                      label: "Berstatus",
                    },
                  ];
                  return (
                    <CustomInputWrapper error={errors.detailStatus}>
                      <Select
                        options={options}
                        placeholder="Silahkan pilih status jalan..."
                        className={classnames("react-select", {
                          "is-invalid": errors.detailStatus,
                        })}
                        classNamePrefix="select"
                        onChange={(value) => {
                          onChange(value.value);
                        }}
                        value={options.find((option) => option.value === value)}
                        menuPlacement="auto"
                      />
                    </CustomInputWrapper>
                  );
                }}
              />
            </Col>
          )}
          {statusJalan === "Lainnya" && (
            <Col md="6" className="mb-1">
              <Label className="form-label" for="detailStatus">
                Keterangan Status Jalan Lainnya
              </Label>
              <Controller
                id="detailStatus"
                name="detailStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="cth: Status lainnya"
                    invalid={errors.detailStatus && true}
                    {...field}
                  />
                )}
              />
              {errors.detailStatus && (
                <FormFeedback>{errors.detailStatus.message}</FormFeedback>
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
export default FormPemdaSkalaBesar;
