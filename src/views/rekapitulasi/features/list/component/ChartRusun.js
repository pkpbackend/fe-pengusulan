import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

import { useRekapitulasiPerProvinsiQuery } from "../../../domains";
import { Colors } from "./chart/colors";
import BarChart from "./chart/BarChart";
import PieChart from "./chart/PieChart";
import { Legends } from "./chart/legends";

const ChartRusun = ({ filtered, formFilter }) => {
  let { data } = useRekapitulasiPerProvinsiQuery(
    {
      direktoratId: 1,
      tahunUsulan: formFilter?.tahunUsulan,
      wilayah: formFilter?.wilayah?.length ? JSON.stringify(formFilter?.wilayah?.map(x=> x?.value)) : JSON.stringify(filtered?.wilayah),
      // provinsiIds: formFilter?.provinsiIds?.length ? JSON.stringify(formFilter?.provinsiIds?.map(x=> x?.value)) : JSON.stringify(filtered?.provinsiIds),
    },
    { skip: !formFilter?.tahunUsulan }
  );

  const mappingData = data?.length ?
    data?.map((item) => ({
      name: item?.provinsi?.nama || "",
      label: item?.provinsi?.nama || "",
      value: item.jumlah,
      color: Colors[Math.floor(Math.random()*Colors.length)],
      id: item?.provinsi?.id
    }))
    ?.filter(y => formFilter?.provinsiIds?.length ? (formFilter?.provinsiIds?.map(j=> j?.value))?.includes(y?.id) : y)
    ?.filter(x=> x?.name) : [{
      name: '-',
      label: '-',
      value: 9999999999999,
      color: '#c6c4ce'
    }]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekapitulasi Usulan Rumah Susun</CardTitle>
      </CardHeader>
      <CardBody style={{ minHeight: 400 }}>
        <Row className="g-4 mt-2">
          <Col sm={12}>
          {
            formFilter?.chartType === 'pie' ?
            <PieChart dataRekap={mappingData} canvasName={"ChartRusun"}/>
            :
            formFilter?.chartType === 'bar' &&
            <BarChart dataRekap={mappingData} canvasName={"ChartRusun"}/>
          }
          </Col>
          <Col sm={12} className="d-flex align-item-center justify-content-center">
            <Legends items={mappingData}/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ChartRusun;
