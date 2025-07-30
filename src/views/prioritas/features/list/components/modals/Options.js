// ** React Imports
import { Check, X } from "react-feather";
import { Controller, useFieldArray, useForm } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

// ** Query
import { useEffect } from "react";
import {
  useJenisPrioritasQuery,
  useRangkaianProgramPrioritasQuery,
} from "../../../../domains/prioritas";

const SwitchCustomLabel = ({ htmlFor }) => {
  return (
    <Label className="form-check-label" htmlFor={htmlFor}>
      <span className="switch-icon-left">
        <Check size={14} />
      </span>
      <span className="switch-icon-right">
        <X size={14} />
      </span>
    </Label>
  );
};

const Options = (props) => {
  const { open, onClose, onSubmit, initialValues } = props;

  // ** query
  const { data: dataPrioritasJenis } = useJenisPrioritasQuery();
  const { data: dataRangkaianProgram } = useRangkaianProgramPrioritasQuery();

  // ** hook form
  const { control, reset, handleSubmit } = useForm({});
  const { fields: fieldsPrioritasJenis } = useFieldArray({
    control,
    name: "prioritasJenis",
  });
  const { fields: fieldsPrioritasRangkaianPemrograman } = useFieldArray({
    control,
    name: "prioritasRangkaianPemrograman",
  });

  useEffect(() => {
    let defaultValues = {};
    if (dataPrioritasJenis.length > 0) {
      defaultValues.prioritasJenis = dataPrioritasJenis
        ?.filter((x) => x?.value !== 5 && x?.value !== 7)
        .map((item) => ({
          ...item,
          value: item.keyPrioritas,
          checked: initialValues.prioritasJenis.includes(item.keyPrioritas),
        }));
    }
    if (dataRangkaianProgram) {
      defaultValues.prioritasRangkaianPemrograman = Object.entries(
        dataRangkaianProgram
      ).map(([value, label]) => ({
        value: Number(value),
        label,
        checked: initialValues.prioritasRangkaianPemrograman.includes(
          Number(value)
        ),
      }));
    }
    reset(defaultValues);
  }, [
    dataPrioritasJenis,
    dataRangkaianProgram,
    initialValues.prioritasJenis,
    initialValues.prioritasRangkaianPemrograman,
    reset,
  ]);

  function handleReset() {
    reset({
      prioritasJenis: fieldsPrioritasJenis.map((item) => ({
        ...item,
        checked: false,
      })),
      prioritasRangkaianPemrograman: fieldsPrioritasRangkaianPemrograman.map(
        (item) => ({
          ...item,
          checked: false,
        })
      ),
    });
  }
  function handleOnSubmit(values) {
    const filtered = {
      prioritasJenis: values.prioritasJenis
        .filter((item) => item.checked)
        .map((item) => item.value),
      prioritasRangkaianPemrograman: values.prioritasRangkaianPemrograman
        .filter((item) => item.checked)
        .map((item) => item.value),
    };
    onSubmit(filtered);
  }
  return (
    <Modal isOpen={open} toggle={() => onClose()} centered size="xl">
      <ModalHeader toggle={() => onClose()}>
        Filter Usulan Prioritas
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="6" className="mb-1">
            <Table size="sm" responsive>
              <tbody>
                {fieldsPrioritasJenis?.map((field, index) => {
                  return (
                    <tr key={field?.id}>
                      <td className="row-head">{field?.label}</td>
                      <td>
                        <Controller
                          name={`prioritasJenis.${index}.checked`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <div className="form-switch form-check-primary">
                                <Input
                                  id={`prioritasJenis.${index}.checked`}
                                  type="switch"
                                  value={field.value}
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                                <SwitchCustomLabel
                                  htmlFor={`prioritasJenis.${index}.checked`}
                                />
                              </div>
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
          <Col md="6" className="mb-1">
            <h5>Rangkaian Pemrograman</h5>
            <hr className="mb-0"></hr>
            <Table size="sm" responsive>
              <tbody>
                {fieldsPrioritasRangkaianPemrograman?.map((field, index) => {
                  return (
                    <tr key={field?.id}>
                      <td className="row-head">{field?.label}</td>
                      <td>
                        <Controller
                          name={`prioritasRangkaianPemrograman.${index}.checked`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <div className="form-switch form-check-primary">
                                <Input
                                  id={`prioritasRangkaianPemrograman.${index}.checked`}
                                  type="switch"
                                  value={field.value}
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                                <SwitchCustomLabel
                                  htmlFor={`prioritasRangkaianPemrograman.${index}.checked`}
                                />
                              </div>
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter
        style={{
          display: "flex",
        }}
      >
        <Button color="primary" outline onClick={() => handleReset()}>
          Reset
        </Button>
        <Button color="primary" onClick={() => handleSubmit(handleOnSubmit)()}>
          Selesai
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Options;
