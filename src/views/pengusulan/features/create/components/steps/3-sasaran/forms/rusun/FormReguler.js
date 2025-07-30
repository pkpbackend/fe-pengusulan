// ** React Imports
import { useEffect, useRef } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { formSchemaReguler } from "./schema";
import {
  useDesaQuery,
  useKabupatenQuery,
  useKecamatanQuery,
  useProvinsiQuery,
} from "@globalapi/wilayah";
import { usePenerimaManfaatQuery } from "@globalapi/usulan";
import LeafletMaps from "../../components/LeafletMaps";

// ** Third Party Components
import Cleave from "cleave.js/react";
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import "intersection-observer";
import { useIsVisible } from "react-is-visible";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

// ** styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";

const FormReguler = (props) => {
  const nodeRef = useRef();
  const isVisible = useIsVisible(nodeRef);

  // ** props
  const {
    stepper,
    form: { setFormData, formData },
  } = props;

  // ** Hooks
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      penerimaManfaat: formData.penerimaManfaat || "",
      jumlahUnit: formData.jumlahUnit || "",
      jumlahTower: formData.jumlahTower || "",
      provinsi: formData.provinsi || "",
      kabupaten: formData.kabupaten || "",
      kecamatan: formData.kecamatan || "",
      desa: formData.desa || "",
      latitude: formData.latitude || "",
      longitude: formData.longitude || "",
    },
    resolver: yupResolver(formSchemaReguler),
  });
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const provinsiId = watch("provinsi");
  const kabupatenId = watch("kabupaten");
  const kecamatanId = watch("kecamatan");

  // ** query
  const queryPenerimaManfaat = usePenerimaManfaatQuery({
    DirektoratId: formData.jenisUsulan.value,
    page: 1,
    pageSize: 99999,
  });
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
    });
    return () => subscription.unsubscribe();
  }, [watch, queryKabupaten?.data]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
        penerimaManfaat: queryPenerimaManfaat.data?.find(
          (c) => c.id === Number(data.penerimaManfaat)
        ),
        provinsi: queryProvinsi.data.find(
          (c) => c.id === Number(data.provinsi)
        ),
        kabupaten: queryKabupaten.data.find(
          (c) => c.id === Number(data.kabupaten)
        ),
        kecamatan: queryKecamatan.data.find(
          (c) => c.id === Number(data.kecamatan)
        ),
        desa: queryDesa.data.find((c) => c.id === Number(data.desa)),
      }));
      stepper.next();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="penerimaManfaat">
            Penerima Manfaat
          </Label>
          <Controller
            id="penerimaManfaat"
            name="penerimaManfaat"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={errors.penerimaManfaat}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder="Silahkan pilih penerima manfaat..."
                  className={classnames("react-select", {
                    "is-invalid": errors.penerimaManfaat,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val.id);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.tipe}
                  value={
                    queryPenerimaManfaat?.data?.find((c) => c.id === value) ||
                    ""
                  }
                  options={queryPenerimaManfaat?.data || []}
                  isLoading={queryPenerimaManfaat?.isLoading || false}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="jumlahUnit">
            Jumlah Unit
          </Label>
          <Controller
            id="jumlahUnit"
            name="jumlahUnit"
            control={control}
            render={({ field }) => (
              <Cleave
                className={classnames("form-control", {
                  "is-invalid": errors.jumlahUnit,
                })}
                placeholder="10,000"
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                }}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.rawValue);
                }}
              />
            )}
          />
          {errors.jumlahUnit && (
            <FormFeedback>{errors.jumlahUnit.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="jumlahTower">
            Jumlah Tower
          </Label>
          <Controller
            id="jumlahTower"
            name="jumlahTower"
            control={control}
            render={({ field }) => (
              <Cleave
                className={classnames("form-control", {
                  "is-invalid": errors.jumlahTower,
                })}
                placeholder="10,000"
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                }}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.rawValue);
                }}
              />
            )}
          />
          {errors.jumlahTower && (
            <FormFeedback>{errors.jumlahTower.message}</FormFeedback>
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                  value={queryProvinsi?.data?.find((c) => c.id === value) || ""}
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
      <div ref={nodeRef}>
        {kabupatenId !== "" && kabupatenId !== "0" && (
          <>
            {isVisible && (
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
                          <FormFeedback>
                            {errors.longitude.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </div>
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
  );
};

export default FormReguler;
