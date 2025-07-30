// ** React Imports
import { useEffect } from "react";

// ** Utils
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import LeafletMaps from "../../../components/LeafletMaps";

// ** Third Party Components
import Cleave from "cleave.js/react";
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { Trash } from "react-feather";

// ** Reactstrap Imports
import { Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
import { useDesaQuery } from "@globalapi/wilayah";

const FormSasaran = (props) => {
  const {
    index,
    hookForm: { remove },
    data: { queryKabupaten, queryKecamatan },
  } = props;
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const kabupatenId = useWatch({
    control,
    name: `kabupaten`,
  });
  const kecamatan = useWatch({
    control,
    name: `sasarans.${index}.kecamatan`,
  });
  const latitude = useWatch({
    control,
    name: `sasarans.${index}.latitude`,
  });
  const longitude = useWatch({
    control,
    name: `sasarans.${index}.longitude`,
  });

  // ** query
  const queryDesa = useDesaQuery(kecamatan?.id, {
    skip: !kecamatan?.id,
  });
  useEffect(() => {
    if (kabupatenId) {
      const kabupaten = queryKabupaten?.data?.find((c) => c.id === kabupatenId);

      if (kabupaten) {
        if (kabupaten.latitude !== "" && kabupaten.longitude !== "") {
          setValue(
            `sasarans.${index}.latitude`,
            parseFloat(kabupaten.latitude),
            { shouldDirty: true }
          );
          setValue(
            `sasarans.${index}.longitude`,
            parseFloat(kabupaten.longitude),
            { shouldDirty: true }
          );
        }
      }
    }
  }, [kabupatenId, index]);

  // error populations
  let error = {};
  if (errors.sasarans) {
    if (errors.sasarans[index]) {
      error = errors.sasarans[index];
    }
  }

  return (
    <Col md="12" className="mb-1">
      <hr></hr>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 className="mb-0">Sasaran {index + 1}</h5>
        <Button
          size="sm"
          color="danger"
          className="btn-next"
          onClick={() => {
            remove(index);
          }}
        >
          <Trash size={14} className="align-middle ms-0 me-0" />
        </Button>
      </div>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="kecamatan">
            Kecamatan
          </Label>
          <Controller
            id="kecamatan"
            name={`sasarans.${index}.kecamatan`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.kecamatan}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih kecamatan..."
                  className={classnames("react-select", {
                    "is-invalid": error.kecamatan,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  value={
                    queryKecamatan?.data?.find(
                      (c) => c.id === (value?.id || 0)
                    ) || ""
                  }
                  options={queryKecamatan?.data || []}
                  isLoading={queryKecamatan?.isLoading || false}
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
            name={`sasarans.${index}.desa`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.desa}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih desa..."
                  className={classnames("react-select", {
                    "is-invalid": error.desa,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nama}
                  value={
                    queryDesa?.data?.find((c) => c.id === (value?.id || 0)) ||
                    ""
                  }
                  options={queryDesa?.data || []}
                  isLoading={queryDesa?.isLoading || false}
                  isDisabled={!kecamatan || kecamatan === "0"}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for={`sasarans.${index}.jumlahUnit`}>
            Jumlah Unit
          </Label>
          <Controller
            id={`sasarans.${index}.jumlahUnit`}
            name={`sasarans.${index}.jumlahUnit`}
            control={control}
            render={({ field }) => {
              return (
                <Cleave
                  className={classnames("form-control", {
                    "is-invalid": error.jumlahUnit,
                  })}
                  placeholder="10,000"
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.rawValue);
                  }}
                  value={field.value}
                  min={1}
                />
              );
            }}
          />
          {error.jumlahUnit && (
            <FormFeedback>{error.jumlahUnit.message}</FormFeedback>
          )}
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col md="6" className="mb-1">
          <LeafletMaps
            latitude={parseFloat(latitude)}
            longitude={parseFloat(longitude)}
            onDragEnd={(marker) => {
              if (marker !== null) {
                setValue(`sasarans.${index}.latitude`, marker.getLatLng().lat, {
                  shouldDirty: true,
                });
                setValue(
                  `sasarans.${index}.longitude`,
                  marker.getLatLng().lng,
                  {
                    shouldDirty: true,
                  }
                );
              } else {
                setValue(`sasarans.${index}.latitude`, "", {
                  shouldDirty: true,
                });
                setValue(`sasarans.${index}.longitude`, "", {
                  shouldDirty: true,
                });
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
                name={`sasarans.${index}.latitude`}
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
                name={`sasarans.${index}.longitude`}
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
    </Col>
  );
};

export default FormSasaran;
