// ** React Imports
import { useEffect } from "react";

// ** Utils
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { useDesaQuery } from "../../../../../../../../../../api/domains/wilayah";

import LeafletMaps from "../../../components/LeafletMaps";

// ** Third Party Components
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { Trash } from "react-feather";

// ** Reactstrap Imports
import { Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

const FormLokasi = (props) => {
  const {
    index,
    hookForm: { remove },
    data: { queryKabupaten, queryKecamatan },
  } = props;
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const kabupatenId = useWatch({
    control,
    name: `kabupaten`,
  });
  const kecamatan = useWatch({
    control,
    name: `lokasi.${index}.kecamatan`,
  });
  const latitude = useWatch({
    control,
    name: `lokasi.${index}.latitude`,
  });
  const longitude = useWatch({
    control,
    name: `lokasi.${index}.longitude`,
  });

  // ** query
  const queryDesa = useDesaQuery(kecamatan?.id, {
    skip: !kecamatan?.id || kecamatan?.id === "0",
  });

  useEffect(() => {
    if (kabupatenId) {
      const kabupaten = queryKabupaten?.data?.find((c) => c.id === kabupatenId);
      if (kabupaten) {
        if (kabupaten.latitude !== "" && kabupaten.longitude !== "") {
          setValue(`lokasi.${index}.latitude`, parseFloat(kabupaten.latitude), {
            shouldDirty: true,
          });
          setValue(
            `lokasi.${index}.longitude`,
            parseFloat(kabupaten.longitude),
            { shouldDirty: true }
          );
        }
      }
    }
  }, [kabupatenId, index]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === `lokasi.${index}.kecamatan`) {
        setValue(`lokasi.${index}.desa`, "", { shouldDirty: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, index]);

  // error populations
  let error = {};
  if (errors.lokasi) {
    if (errors.lokasi[index]) {
      error = errors.lokasi[index];
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
        }}
      >
        <h5>Sasaran {index + 1}</h5>
        <Button
          size="sm"
          color="danger"
          className="btn-next"
          onClick={() => {
            console.log("remove", index);
            remove(index);
          }}
        >
          <Trash size={14} className="align-middle ms-0 me-0" />
        </Button>
      </div>
      <Row>
        <Col md="6" className="mb-1 mb-sm-0">
          <Label className="form-label" for="kecamatan">
            Kecamatan
          </Label>
          <Controller
            id="kecamatan"
            name={`lokasi.${index}.kecamatan`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.kecamatan}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
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
                    queryKecamatan?.data?.find((c) => c.id === value.id) || ""
                  }
                  options={queryKecamatan?.data || []}
                  isLoading={queryKecamatan?.isLoading || false}
                  isDisabled={!kabupatenId || kabupatenId === "0"}
                />
              </CustomInputWrapper>
            )}
          />
        </Col>
        <Col md="6">
          <Label className="form-label" for="desa">
            Desa/Kelurahan
          </Label>
          <Controller
            id="desa"
            name={`lokasi.${index}.desa`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.desa}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
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
                  value={queryDesa?.data?.find((c) => c.id === value.id) || ""}
                  options={queryDesa?.data || []}
                  isLoading={queryDesa?.isLoading || false}
                  isDisabled={!kecamatan?.id || kecamatan?.id === "0"}
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
                    setValue(
                      `lokasi.${index}.latitude`,
                      marker.getLatLng().lat,
                      {
                        shouldDirty: true,
                      }
                    );
                    setValue(
                      `lokasi.${index}.longitude`,
                      marker.getLatLng().lng,
                      {
                        shouldDirty: true,
                      }
                    );
                  } else {
                    setValue(`lokasi.${index}.latitude`, "", {
                      shouldDirty: true,
                    });
                    setValue(`lokasi.${index}.longitude`, "", {
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
                    name={`lokasi.${index}.latitude`}
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
                    name={`lokasi.${index}.longitude`}
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
    </Col>
  );
};

export default FormLokasi;
