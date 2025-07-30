
import React, { Fragment, useState } from 'react'
import { Edit } from 'react-feather'
import { Button, Table } from "reactstrap"

import FormEditUsulan from "../FormEditUsulan"

const InformasiUsulanDetail = (props) => {
  const { data } = props

  const [formToggle, setFormToggle] = useState({
    DirektoratId: 1,
    recordActive: {},
    open: false,
  })

  return (
    <>
      <Table size="sm" responsive>
        <thead>
          <tr>
            
            {data.DirektoratId === 3?(
              <Fragment>
                <th>Wilayah</th>
              </Fragment>
            ):(
              <Fragment>
                <th>Provinsi</th>
                <th>Kabupaten/Kota</th>
              </Fragment>
            )}
            <th style={{ textAlign: 'center' }}>Jumlah Unit</th>
            <th>No. SK</th>
            {data.DirektoratId === 3 && (
              <Fragment>
                <th>No. SK Kec/Des</th>
                <th>Edit</th>
              </Fragment>
            )}
          </tr>
        </thead>
        <tbody>
          {data.PenetapanUsulans.map(({
            id,
            Provinsi,
            City, 
            Kecamatan, 
            Desa,
            jumlahUnit,
            Usulan,
            KdUsulan,
            ...recordActive
          }) => (
            <tr key={`usulan-${id}`}>
              
              {data.DirektoratId === 3?(
                <Fragment>
                  <td>
                    <table style={{ fontSize: 12 }}>
                      <tr>
                        <td>Provinsi</td>
                        <td>: {Provinsi?.nama}</td>
                      </tr>
                      <tr>
                        <td>Kabupaten/<br />Kota</td>
                        <td>: {City?.nama}</td>
                      </tr>
                      <tr>
                        <td>Kecamatan</td>
                        <td>: {Kecamatan?.nama || '-'}</td>
                      </tr>
                      <tr>
                        <td>Desa</td>
                        <td>: {Desa?.nama || '-'}</td>
                      </tr>
                    </table>
                    {/* Provinsi: {Provinsi?.nama}<br />
                    Kabupaten/Kota: {City?.nama}<br />
                    Kecamatan: {Kecamatan?.nama || '-'}<br />
                    Desa: {Desa?.nama || '-'} */}
                  </td>
                </Fragment>
              ):(
                <Fragment>
                  <td>{Provinsi?.nama}</td>
                  <td>{City?.nama}</td>
                </Fragment>
              )}
              <td style={{ textAlign: 'center' }}>
                {jumlahUnit}
              </td>
              <td>{Usulan?.noUsulan}</td>
              {data.DirektoratId === 3 && (
                <Fragment>
                  <td>{KdUsulan?.noUsulan}</td>
                  <td>
                    <Button 
                      color="primary" 
                      size="sm"
                      onClick={() => {
                        setFormToggle({
                          DirektoratId: data.DirektoratId,
                          recordActive,
                          open: true,
                        })
                      }}
                    >
                      <Edit size={12} />
                    </Button>
                  </td>
                </Fragment>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <FormEditUsulan
        toggle={formToggle}
        onClose={() => setFormToggle({ open: false })}
      />
    </>
  )
}

export default InformasiUsulanDetail
