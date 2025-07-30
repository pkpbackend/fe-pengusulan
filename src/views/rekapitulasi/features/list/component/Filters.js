import { useFilterPengusulanTahunUsulanQuery } from "@globalapi/filter";
import { useEffect } from "react";
import Select from "react-select";
import styles from './styles.module.scss'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  FormGroup,
  Label,
  UncontrolledAccordion,
} from "reactstrap";

const Filters = ({ filtered, formFilter, setFormFilter, provinsi, loading }) => {
  const { data, isLoading, isFetching } = useFilterPengusulanTahunUsulanQuery({});

  const handleSelectChange = (attr, value) => {
    setFormFilter({
      ...formFilter,
      [attr]: value.value,
    });
  };

  useEffect(() => {
    if (data?.tahunUsulan?.length > 0) {
      setFormFilter({
        ...formFilter,
        tahunUsulan: data.tahunUsulan[0]
      });
    }
  }, [data, setFormFilter]);

  const optionsYear =
    data?.tahunUsulan?.map((value) => ({
      label: value,
      value,
    })) || [];

  const optionsProvince = provinsi?.map((value) => ({
      label: value?.nama,
      value: value?.id,
      kodeWilayah: value?.kodeWilayah
    }))
    ?.filter(x => filtered?.wilayah?.length ? (filtered?.wilayah)?.includes(x?.kodeWilayah) : x)
    ?.filter(x => formFilter?.wilayah?.length ? (formFilter?.wilayah?.map(y=> y?.value))?.includes(x?.kodeWilayah) : x)
    ?.sort((a,b) => a?.kodeWilayah - b?.kodeWilayah)

  const optionsChart = [
    {
      label: 'Pie',
      value: 'pie',
    },
    {
      label: 'Bar',
      value: 'bar',
    }
  ]

  const wilayah = [
    {
      kodeWilayah: 1,
      value: ["Sumatra", "Kalimantan"]
    },
    {
      kodeWilayah: 2,
      value: ["Jawa", "Bali", "Nusa Tenggara"]
    },
    {
      kodeWilayah: 3,
      value: ["Sulawesi", "Maluku", "Maluku utara", "Papua", "Papua Barat"]
    }
  ]?.filter(x => filtered?.wilayah?.length ? (filtered?.wilayah)?.includes(x?.kodeWilayah) : x)

  const optionsKodeWilayah = wilayah?.map(x=> ({
    value: x?.kodeWilayah,
    label: `${x?.kodeWilayah} - ${x?.value?.join(", ")}`,
  }))

  useEffect(()=>{
    if (formFilter?.wilayah?.length) {
      const wilayahId = formFilter?.wilayah?.map(x=> x?.value)
      if (formFilter?.provinsiIds?.length) {
        handleSelectChange("provinsiIds", {
          value: formFilter?.provinsiIds?.filter(x=> (wilayahId)?.includes(x?.kodeWilayah))
        })
      }
    }
  },[formFilter?.wilayah])

  return (
    <UncontrolledAccordion className="mb-2" defaultOpen={"1"}>
      <AccordionItem className="shadow">
        <AccordionHeader targetId="1">Filter</AccordionHeader>
        <AccordionBody accordionId="1">
          <FormGroup row className={styles.mb0}>
            <Label sm={2}>Tahun Usulan</Label>
            <Col sm={10}>
              <Select
                options={optionsYear}
                value={
                  optionsYear?.find((year) => year.value === formFilter.tahunUsulan) || ""
                }
                classNamePrefix="select"
                placeholder="Pilih tahun usulan..."
                isLoading={isLoading || isFetching}
                isDisabled={loading}
                onChange={(value) =>
                  handleSelectChange("tahunUsulan", value)
                }
              />
            </Col>
          </FormGroup>
          <FormGroup row className={styles.mb0}>
            <Label sm={2}>Tipe Chart</Label>
            <Col sm={10}>
              <Select
                options={optionsChart}
                value={
                  optionsChart?.find((chart) => chart.value === formFilter.chartType) || ""
                }
                classNamePrefix="select"
                placeholder="Pilih tipe chart..."
                isLoading={isLoading || isFetching}
                isDisabled={loading}
                onChange={(value) =>
                  handleSelectChange("chartType", value)
                }
              />
            </Col>
          </FormGroup>
          <FormGroup row className={styles.mb0}>
            <Label sm={2}>Wilayah</Label>
            <Col sm={10}>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={optionsKodeWilayah}
                value={formFilter?.wilayah}
                classNamePrefix="select"
                placeholder="Pilih wilayah..."
                isDisabled={loading}
                style={{
                  color: 'black'
                }}
                onChange={(value) => {
                  handleSelectChange("wilayah", {
                    value: [...value]
                  })
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row className={styles.mb0}>
            <Label sm={2}>Provinsi</Label>
            <Col sm={10}>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={optionsProvince}
                value={formFilter?.provinsiIds}
                classNamePrefix="select"
                placeholder="Pilih provinsi..."
                isLoading={provinsi?.loadingProvince || provinsi?.fetchingProvince}
                isDisabled={loading}
                style={{
                  color: 'black'
                }}
                onChange={(value) => {
                  handleSelectChange("provinsiIds", {
                    value: [...value]
                  })
                }}
              />
            </Col>
          </FormGroup>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default Filters;
