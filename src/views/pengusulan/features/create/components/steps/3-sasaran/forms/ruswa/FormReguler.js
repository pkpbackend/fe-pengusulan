// ** React Imports
import { useEffect } from "react";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { formSchemaReguler } from "./schema";

// ** Third Party Components
import Cleave from "cleave.js/react";
import classnames from "classnames";
import Select from "react-select"; // eslint-disable-line
import {
  useForm,
  useWatch,
  FormProvider,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";

// ** Reactstrap Imports
import { Form, Label, Row, Col, Button } from "reactstrap";

// ** styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";

import FormSasaran from "./child/FormSasaran";

import { usePenerimaManfaatQuery } from "@globalapi/usulan";
import {
  useProvinsiQuery,
  useKecamatanQuery,
  useKabupatenQuery,
} from "@globalapi/wilayah";

const JumlahUnitPkField = ({ control, setValue }) => {
  const sasarans = useWatch({ control, name: "sasarans" });
  const jumlahUnitPk = _.sumBy(sasarans, (sasaran) =>
    sasaran.jumlahUnit ? Number(sasaran.jumlahUnit) : 0
  );
  setValue("jumlahUnitPk", jumlahUnitPk);
  return (
    <>
      <Label className="form-label" for="jumlahUnitPk">
        Peningkatan Kualitas (PK)
      </Label>
      <Cleave
        className="form-control"
        options={{
          numeral: true,
          numeralThousandsGroupStyle: "thousand",
        }}
        value={jumlahUnitPk}
        min={1}
        disabled
      />
    </>
  );
};
const FormReguler = (props) => {
  // ** props
  const {
    stepper,
    form: { setFormData, formData },
  } = props;

  // ** Hooks
  const forms = useForm({
    defaultValues: {
      penerimaManfaat: formData?.penerimaManfaat || "",
      jumlahUnitPk: formData?.jumlahUnitPk,
      provinsi: formData?.provinsi || "",
      kabupaten: formData?.kabupaten || "",
      sasarans: formData?.sasarans || [],
    },
    resolver: yupResolver(formSchemaReguler()),
  });
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = forms;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sasarans",
  });

  const provinsiId = watch("provinsi");
  const kabupatenId = watch("kabupaten");

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

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === "provinsi") {
        setValue("kabupaten", "0", { shouldDirty: true });
        remove();
      }
      if (type === "change" && name === "kabupaten") {
        remove();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, remove]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        ...data,
        penerimaManfaat: queryPenerimaManfaat?.data?.find(
          (c) => c.id === Number(data.penerimaManfaat)
        ),
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
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
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
                      [...(queryPenerimaManfaat?.data || [])].find(
                        (c) => c.id === value
                      ) || ""
                    }
                    options={[...(queryPenerimaManfaat?.data || [])]}
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
                    isDisabled={!provinsiId}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col md="12">
            <h5 className="mb-1">Jumlah Unit</h5>
          </Col>
          <Col md="6" className="mb-1">
            <JumlahUnitPkField control={control} setValue={setValue} />
          </Col>
        </Row>
        <hr></hr>
        {kabupatenId !== "0" && kabupatenId !== "" && (
          <>
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
                    <h5 className="mb-0">Daftar Sasaran/Lokasi</h5>
                    {errors.sasarans && !Array.isArray(errors.sasarans) && (
                      <span className="text-danger">
                        {errors.sasarans.message}
                      </span>
                    )}
                  </div>

                  <Button
                    color="primary"
                    size="md"
                    className="btn-next"
                    onClick={() => {
                      append({ jumlahUnit: "", jumlahRtlh: "" });
                    }}
                  >
                    <Plus
                      size={14}
                      className="align-middle ms-sm-25 me-0"
                    ></Plus>
                    <span className="align-middle d-sm-inline-block d-none">
                      Tambah Sasaran
                    </span>
                  </Button>
                </div>
              </Col>
              <Col md="12">
                <Row>
                  {fields.map((field, index) => {
                    return (
                      <div key={index}>
                        <FormSasaran
                          index={index}
                          field={field}
                          hookForm={{
                            remove,
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
          </>
        )}
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

export default FormReguler;
