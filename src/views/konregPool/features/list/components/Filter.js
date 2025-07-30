import { useState } from "react";

// ** Utils
import { OPTION_ALL } from "@constants/global";
import { TIPE_USULAN } from "@constants/usulan";
import { useFilterTahunUsulanQuery } from "@globalapi/usulan";
import { useKabupatenQuery, useProvinsiQuery } from "@globalapi/wilayah";

// ** Third Party Components
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

// ** Reactstrap Imports
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";

// ** styles
import "@styles/react/libs/react-select/_react-select.scss";

import { Search } from "react-feather";

const Filter = (props) => {
  const { handleTableAttrChange } = props;

  // ** Local State
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  // ** Hooks
  const { control, watch, handleSubmit, reset } = useForm();
  const provinsiId = watch("Usulan_ProvinsiId");
  // ** query
  const queryProvinsi = useProvinsiQuery({}, { skip: !open });
  const queryKabupaten = useKabupatenQuery(provinsiId, {
    skip: !provinsiId || provinsiId === "" || !open,
  });
  const queryFilterTahunUsulan = useFilterTahunUsulanQuery({}, { skip: !open });

  const onSubmit = (data) => {
    const filtered = [];
    const convertKey = (key) => {
      return key?.split("_").join(".");
    };

    for (const key of Object.keys(data || {})) {
      if (data?.[key]) {
        filtered.push({
          id: convertKey(key),
          value: data?.[key],
        });
      }
    }
    handleTableAttrChange({
      conditions: filtered.length ? filtered : null,
      page: 1,
    });
  };

  // controlled select options
  const optionsDirectorat = [
    OPTION_ALL,
    ...TIPE_USULAN.map((item) => ({
      value: item.direktorat,
      label: item.name,
    })),
  ];
  const optionsProvinsi = [
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
  const optionsFilterTahunUsulan = [
    OPTION_ALL,
    ...(queryFilterTahunUsulan?.data?.tahunUsulan?.map((item) => ({
      value: item,
      label: item,
    })) || []),
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
              <Col md="6" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="Usulan_DirektoratId">
                      Kegiatan
                    </Label>
                    <Controller
                      name="Usulan_DirektoratId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="Usulan_DirektoratId"
                          value={
                            optionsDirectorat.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsDirectorat}
                          placeholder="Silahkan pilih kegiatan..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="konregYear">
                      Tahun Konreg
                    </Label>
                    <Controller
                      name="konregYear"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="konregYear"
                          placeholder="Masukan tahun konreg"
                          {...field}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md="6" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="Usulan_ProvinsiId">
                      Provinsi
                    </Label>
                    <Controller
                      name="Usulan_ProvinsiId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="Usulan_ProvinsiId"
                          value={
                            optionsProvinsi?.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsProvinsi}
                          placeholder="Silahkan pilih provinsi..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="Usulan_CityId">
                      Kabupaten/Kota
                    </Label>
                    <Controller
                      control={control}
                      name="Usulan_CityId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          inputId="Usulan_CityId"
                          value={
                            optionsKabupaten.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKabupaten}
                          placeholder="Silahkan pilih kabupaten..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
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
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value);
                          }}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="filter-actions">
              <Button
                color="secondary"
                outline
                onClick={() => {
                  reset({ konregYear: "" });
                  handleTableAttrChange({ filtered: null });
                }}
              >
                Reset
              </Button>
              <Button type="submit" color="primary">
                <Search size={16} />
                Cari
              </Button>
            </div>
          </Form>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;
