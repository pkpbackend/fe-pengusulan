// ** Custom Components

// ** Third Party Components
import React from "react";
import {
  Table,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import "../../detail.scss";

const RukPerumahanDetail = (props) => {
  const { locations, type } = props;
  const isPemdaSkalaBesar = Number(type) === 5;
  return isPemdaSkalaBesar ? (
    <UncontrolledAccordion
      defaultOpen="perumahan"
      className="shadow mb-2"
      style={{ borderRadius: "0.428rem" }}
    >
      <AccordionItem>
        <AccordionHeader targetId="perumahan" className="title-accordion-text">
          Perumahan
        </AccordionHeader>
        <AccordionBody accordionId="perumahan">
          <Table size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Perumahan</th>
                <th>Jumlah Rumah Umum</th>
                <th>Jumlah Rumah Menengah</th>
                <th>Jumlah Rumah Mewah</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item?.namaPerumahan}</td>
                    <td>{`${item?.jmlRumahUmum.toLocaleString()} (${
                      item?.presentaseRumahUmum
                    }%)`}</td>
                    <td>{`${item?.jmlRumahMenengah.toLocaleString()} (${
                      item?.presentaseRumahMenengah
                    }%)`}</td>
                    <td>{`${item?.jmlRumahMewah.toLocaleString()} (${
                      item?.presentaseRumahMewah
                    }%)`}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  ) : null;
};

export default RukPerumahanDetail;
