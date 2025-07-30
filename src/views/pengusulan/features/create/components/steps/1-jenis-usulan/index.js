// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Utils
import {
  ALL_DIREKTORAT_ID,
  JENIS_DATA_USULAN,
  TIPE_USULAN,
} from "@constants/usulan";
import { CustomInputWrapper } from "@customcomponents/form/CustomInput";
import { isObjEmpty } from "@utils/Utils";

// ** Third Party Components
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select"; // eslint-disable-line
import * as yup from "yup";
import _ from "lodash";

// ** Reactstrap Imports
import { Button, Col, Form, Label, Row } from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import DataEntryDeadline from "../../DataEntryDeadline";
import { useSelector } from "react-redux";

const defaultValues = {
  jenisData: "",
  jenisUsulan: "",
  type: "",
};

const JenisUsulan = ({ stepper, form }) => {
  const userDirektoratId = useSelector(
    (state) => state.auth.user?.Role?.DirektoratId
  );

  const currentRole = useSelector((state) => state.auth.user?.Role);

  // ** Props
  const { setFormData } = form;

  // ** Local State
  const [allowCreate, setAllowCreate] = useState(false);
  const [options, setOptions] = useState({
    jenisUsulan: [],
    jenisData: [],
    type: [],
  });

  // ** Validation Schema
  const JenisUsulanSchema = () =>
    yup.object().shape({
      jenisUsulan: yup.string().required("Tipe Usulan wajib diisi..."),
      jenisData: yup.string().required("Jenis Usulan wajib diisi..."),
      type: yup.string().when("jenisUsulan", {
        is: (val) => Number(val) === 4,
        then: () => yup.string().required("Jenis Perumahan wajib diisi..."),
      }),
    });

  // ** Hooks
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(JenisUsulanSchema()),
  });

  useEffect(() => {
    if (userDirektoratId !== ALL_DIREKTORAT_ID) {
      reset({ jenisUsulan: userDirektoratId });
    }
  }, [reset, userDirektoratId]);

  const selectedJenisUsulan = watch("jenisUsulan");
  const selectedJenisData = watch("jenisData");

  useEffect(() => {
    setOptions((val) => ({
      ...val,
      jenisUsulan: TIPE_USULAN?.map((item) => ({
        value: item.direktorat,
        label: item.name,
      })),
    }));
  }, []);

  useEffect(() => {
    const jenisData = JENIS_DATA_USULAN.non_ruk.filter((item) => {
      return item.direktorat.includes(selectedJenisUsulan);
    });

    if (currentRole.pengembang) {
      setOptions((val) => ({
        ...val,
        jenisData: jenisData.filter((item) => {
          return item.value == 7;
        }),
      }));
    } else {
      setOptions((val) => ({
        ...val,
        jenisData: _.sortBy(jenisData, "sortIndex"),
      }));
    }

    if (selectedJenisUsulan === 4) {
      let type = [];
      if (selectedJenisData === 7) {
        type = JENIS_DATA_USULAN.ruk.filter(
          (item) => item.create && item?.pengusul?.[0] === "pengembang"
        );
      } else {
        type = JENIS_DATA_USULAN.ruk.filter(
          (item) => item.create && item?.pengusul?.[0] === "pemda"
        );
      }

      setOptions((val) => ({
        ...val,
        type,
      }));
    }
  }, [selectedJenisUsulan, selectedJenisData, currentRole]);

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      setFormData((val) => ({
        ...val,
        jenisUsulan: options?.jenisUsulan?.find(
          (c) => c?.value === Number(data?.jenisUsulan)
        ),
        jenisData: options?.jenisData?.find(
          (c) => c?.value === Number(data?.jenisData)
        ),
        jenisPengusul: data.jenisPengusul,
        type: options.type.find((c) => c.value === Number(data.type)),
      }));
      stepper.next();
    }
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Jenis Usulan Pengusul</h5>
        <small className="text-muted">
          Pilih Jenis Usulan Pengusul sesuai kebutuhan anda.
        </small>
      </div>
      <hr></hr>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="jenisUsulan">
              Tipe Usulan
            </Label>
            <Controller
              id="jenisUsulan"
              name="jenisUsulan"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.jenisUsulan}>
                  <Select
                    options={options.jenisUsulan}
                    placeholder="Silahkan pilih tipe usulan..."
                    className={classnames("react-select", {
                      "is-invalid": errors.jenisUsulan,
                    })}
                    classNamePrefix="select"
                    onChange={(value) => {
                      onChange(value.value);
                    }}
                    value={options.jenisUsulan.find(
                      (item) => item.value === value
                    )}
                    menuPlacement="auto"
                    isDisabled={userDirektoratId !== ALL_DIREKTORAT_ID}
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="jenisData">
              Jenis Usulan
            </Label>
            <Controller
              control={control}
              id="jenisData"
              name="jenisData"
              render={({ field: { onChange, value } }) => (
                <CustomInputWrapper error={errors.jenisData}>
                  <Select
                    options={options?.jenisData}
                    placeholder="Silahkan pilih jenis usulan..."
                    className={classnames("react-select", {
                      "is-invalid": errors.jenisData,
                    })}
                    classNamePrefix="select"
                    onChange={(val) => {
                      onChange(val.value);
                    }}
                    value={
                      options?.jenisData?.find((c) => c.value === value) || ""
                    }
                    menuPlacement="auto"
                  />
                </CustomInputWrapper>
              )}
            />
          </Col>
        </Row>
        {Number(selectedJenisUsulan) === 4 && (
          <Row>
            <Col md="6" className="mb-2">
              <Label className="form-label" for="type">
                Jenis Perumahan
              </Label>
              <Controller
                control={control}
                id="type"
                name="type"
                render={({ field: { onChange, value } }) => (
                  <CustomInputWrapper error={errors.type}>
                    <Select
                      options={options.type}
                      placeholder="Silahkan pilih jenis usulan..."
                      className={classnames("react-select", {
                        "is-invalid": errors.type,
                      })}
                      classNamePrefix="select"
                      onChange={(val) => {
                        onChange(val.value);
                      }}
                      value={options.type.find((c) => c.value === value) || ""}
                      menuPlacement="auto"
                    />
                  </CustomInputWrapper>
                )}
              />
            </Col>
          </Row>
        )}
        <DataEntryDeadline
          jenisUsulan={selectedJenisUsulan}
          onIsValidChange={setAllowCreate}
        />
        <div className="d-flex justify-content-between">
          <Button color="secondary" className="btn-prev" outline disabled>
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Sebelumnya
            </span>
          </Button>
          <Button type="submit" color="primary" disabled={!allowCreate}>
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
    </Fragment>
  );
};

export default JenisUsulan;
