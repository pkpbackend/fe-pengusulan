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
import {
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";

import { useJenisKegiatanQuery } from "@globalapi/usulan";
import { useDesaQuery, useGetRlthDesaQuery } from "@globalapi/wilayah";

const FieldJumlahRtlh = ({ index, control, setValue }) => {
  const desa = useWatch({ name: `sasarans.${index}.desa`, control });
  const queryDataRtlh = useGetRlthDesaQuery(desa?.id, { skip: !desa?.id });
  useEffect(() => {
    if (queryDataRtlh.status === "fulfilled" && queryDataRtlh.data.rtlh) {
      setValue(`sasarans.${index}.jumlahRtlh`, queryDataRtlh.data.rtlh);
    } else {
      setValue(`sasarans.${index}.jumlahRtlh`, "0");
    }
  }, [queryDataRtlh, index, setValue]);
  
  const handleinputchange = (e) =>{
    setValue(`sasarans.${index}.jumlahRtlh`,e.target.value);
  }

  return (
    <>
      <Label className="form-label" for={`sasarans.${index}.jumlahRtlh`}>
        Jumlah RTLH
        {queryDataRtlh.isLoading || queryDataRtlh.isFetching ? (
          <Spinner size="sm" style={{ marginLeft: "0.5rem" }} />
        ) : null}
      </Label>
      <Controller
        id={`sasarans.${index}.jumlahRtlh`}
        name={`sasarans.${index}.jumlahRtlh`}
        control={control}
        render={({ field }) => {
          return (
            <Cleave
              className={classnames("form-control", {
                "is-invalid": queryDataRtlh.isError,
              })}
              options={{
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
              }}
              value={field.value}
              onChange={handleinputchange}
            />
          );
        }}
      />
      {queryDataRtlh.isError && (
        <FormFeedback>
          {queryDataRtlh?.error?.data?.message || "Terjadi Kesalahan"}
        </FormFeedback>
      )}
    </>
  );
};

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
  const jumlahRtlh = useWatch({
    control,
    name: `sasarans.${index}.jumlahRtlh`,
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
  const queryJenisKegiatan = useJenisKegiatanQuery({
    DirektoratId: 3,
  });
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
        <Col md="12" className="mb-1">
          <Label className="form-label" for="jenisKegiatan">
            Jenis Kegiatan
          </Label>
          <Controller
            id="jenisKegiatan"
            name={`sasarans.${index}.jenisKegiatan`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInputWrapper error={error.jenisKegiatan}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPlacement="auto"
                  placeholder="Silahkan pilih jenis kegiatan..."
                  className={classnames("react-select", {
                    "is-invalid": error.jenisKegiatan,
                  })}
                  classNamePrefix="select"
                  onChange={(val) => {
                    onChange(val);
                  }}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  value={
                    queryJenisKegiatan?.data?.find(
                      (c) => c.id === (value?.id || 0)
                    ) || ""
                  }
                  options={queryJenisKegiatan?.data || []}
                  isLoading={queryJenisKegiatan?.isLoading || false}
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
        <Col md="6">
          <FieldJumlahRtlh
            control={control}
            index={index}
            setValue={setValue}
          />
        </Col>
        <Col md="6">
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
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                  onChange={(e) => {
                    field.onChange(Number(e.target.rawValue));
                  }}
                  value={field.value}
                  
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
                    invalid={error.latitude && true}
                    {...field}
                  />
                )}
              />
              {error.latitude && (
                <FormFeedback>{error.latitude.message}</FormFeedback>
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
                    invalid={error.longitude && true}
                    {...field}
                  />
                )}
              />
              {error.longitude && (
                <FormFeedback>{error.longitude.message}</FormFeedback>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default FormSasaran;
