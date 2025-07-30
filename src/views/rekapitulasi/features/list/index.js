import { Fragment, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { getUser } from "@utils/LoginHelpers";
import { useProvinsiQuery } from "@globalapi/wilayah";

import CharPerDirektorat from "./component/CharPerDirektorat";
import ChartRusun from "./component/ChartRusun";
import ChartRusus from "./component/ChartRusus";
import ChartRuswa from "./component/ChartRuswa";
import ChartRUK from "./component/ChartRUK";
import Filters from "./component/Filters";

const Rekapitulasi = () => {
  const { user } = getUser();
  const { data: dataProvince, isLoading: loadingProvince, isFetching: fetchingProvince } = useProvinsiQuery();
  const [formFilter, setFormFilter] = useState({
    tahunUsulan: null,
    chartType: "pie",
    provinsiIds: [],
    wilayah: []
  });
  const [filtered, setFiltered] = useState({
    provinsiIds: [],
    wilayah: []
  });

  useEffect(()=>{
    const provinsifilters = []
    let region = []
    if (user?.ProvinsiId) {
      provinsifilters.push(user?.ProvinsiId)
    }
    if (user?.region) {
      region = JSON.parse(user.region)?.provinsi;
      region?.forEach(val=>{
        provinsifilters.push(val.value)
      })
    }
    const fixDuplicatedProvinsi = provinsifilters.filter(function(value, index, self) { 
      return self.indexOf(value) === index;
    })

    const provinsiFind = dataProvince?.filter(x=> fixDuplicatedProvinsi.length ? (fixDuplicatedProvinsi)?.includes(x?.id) : x)?.map(x=> x?.kodeWilayah)
    const fixDuplicatedWilayah = provinsiFind?.filter(function(value, index, self) { 
      return self.indexOf(value) === index;
    })
    if (filtered?.wilayah?.length !== fixDuplicatedWilayah?.length) {
      setFiltered({
        provinsiIds: fixDuplicatedProvinsi,
        wilayah: fixDuplicatedWilayah
      })
    }
  },[filtered?.wilayah?.length, user, dataProvince])

  return (
    <Fragment>
      <Filters
        filtered={filtered}
        formFilter={formFilter}
        setFormFilter={setFormFilter}
        provinsi={dataProvince}
        loading={loadingProvince || fetchingProvince}
      />
      <br />
      <Row>
        <Col md="12">
          <CharPerDirektorat
            filtered={filtered}
            formFilter={formFilter}
          />
        </Col>
        <Col md="6">
          <ChartRusun
            filtered={filtered}
            formFilter={formFilter}
          />
        </Col>
        <Col md="6">
          <ChartRusus
            filtered={filtered}
            formFilter={formFilter}
          />
        </Col>
        <Col md="6">
          <ChartRuswa
            filtered={filtered}
            formFilter={formFilter}
          />
        </Col>
        <Col md="6">
          <ChartRUK
            filtered={filtered}
            formFilter={formFilter}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Rekapitulasi;
