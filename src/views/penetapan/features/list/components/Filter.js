import { useState } from "react";

// ** Utils
import { OPTION_ALL } from "@constants/global";

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
      setOpen();
    } else {
      setOpen(id);
    }
  };

  // ** Hooks
  const { control, watch, handleSubmit, reset } = useForm();
  // const provinsiId = watch("ProvinsiId")
  // ** query
  // const queryProvinsi = useProvinsiQuery({}, { skip: !open })
  // const queryKabupaten = useKabupatenQuery(provinsiId, {
  //   skip: !provinsiId || provinsiId === "" || !open,
  // })

  const onSubmit = (data) => {
    const conditions = [];
    if (data.tahun) {
      // conditions.push({
      //   id: 'eq$tglSk',
      //   value: data.tahun,
      // })
      conditions.push({
        id: "tahun",
        value: data.tahun,
      });
    }

    handleTableAttrChange({
      conditions,
      page: 1,
    });
  };

  // const optionsProvinsi = [
  //   OPTION_ALL,
  //   ...(queryProvinsi?.data?.map((item) => ({
  //     value: item.id,
  //     label: item.nama,
  //   })) || []),
  // ]

  // const optionsKabupaten = !provinsiId
  //   ? [OPTION_ALL]
  //   : [
  //       OPTION_ALL,
  //       ...(queryKabupaten?.data?.map((item) => ({
  //         value: item.id,
  //         label: item.nama,
  //       })) || []),
  //     ]

  const optionsTahun = [OPTION_ALL];
  const dToday = new Date();
  for (let i = 2019; i <= dToday.getFullYear(); i++) {
    optionsTahun.push({
      value: i,
      label: i,
    });
  }

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
                    <Label className="form-label" for="tahun">
                      Tahun
                    </Label>
                    <Controller
                      control={control}
                      name="tahun"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="tahun"
                          value={
                            optionsTahun.find((c) => c.value === value) || ""
                          }
                          options={optionsTahun}
                          placeholder="Silahkan pilih tahun..."
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
              {/* <Col md="6" className="mb-1">
                <Row>
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="ProvinsiId">
                      Provinsi
                    </Label>
                    <Controller
                      name="ProvinsiId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId="ProvinsiId"
                          value={
                            optionsProvinsi?.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsProvinsi}
                          placeholder="Silahkan pilih provinsi..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value)
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
                    <Label className="form-label" for="CityId">
                      Kabupaten/Kota
                    </Label>
                    <Controller
                      control={control}
                      name="CityId"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          inputId="CityId"
                          value={
                            optionsKabupaten.find((c) => c.value === value) ||
                            ""
                          }
                          options={optionsKabupaten}
                          placeholder="Silahkan pilih kabupaten/kota..."
                          classNamePrefix="select"
                          onChange={(val) => {
                            onChange(val.value)
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
              </Col> */}
            </Row>
            <div className="filter-actions">
              <Button
                color="secondary"
                outline
                onClick={() => {
                  reset({
                    tahun: "",
                    ProvinsiId: "",
                    CityId: "",
                  });
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
