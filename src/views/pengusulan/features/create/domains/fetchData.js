import Axios from "@api/ApiCall"

export const getPenerimaManfaat = async (memoizedOptionSetter) => {
  memoizedOptionSetter("penerimaManfaat", {
    data: [],
    loading: true
  })

  try {
    const result = await Axios.get(`/sample/penerimamanfaat`)
    memoizedOptionSetter("penerimaManfaat", {
      data: result.data?.penerima?.map((item) => ({
        value: item.id,
        label: item.tipe.toUpperCase()
      })),
      loading: false
    })
  } catch (error) {
    memoizedOptionSetter("penerimaManfaat", {
      data: [],
      loading: false,
      error: true
    })
  }
}

export const getProvinsi = async (memoizedOptionSetter) => {
  memoizedOptionSetter("provinsi", {
    data: [],
    loading: true
  })

  try {
    const result = await Axios.get(`/sample/provinsi`)
    memoizedOptionSetter("provinsi", {
      data: result.data?.data?.map((item) => ({
        value: item.id,
        label: item.nama.toUpperCase(),
        ...item
      })),
      loading: false
    })
  } catch (error) {
    memoizedOptionSetter("provinsi", {
      data: [],
      loading: false,
      error: true
    })
  }
}

export const getKabupaten = async (memoizedOptionSetter, provinsiId) => {
  memoizedOptionSetter("kabupaten", {
    data: [],
    loading: true
  })

  try {
    const result = await Axios.get(`/sample/kabupaten`, {
      params: {
        id: provinsiId
      }
    })
    memoizedOptionSetter("kabupaten", {
      data: result.data?.data?.map((item) => ({
        value: item.id,
        label: item.nama.toUpperCase(),
        ...item
      })),
      loading: false
    })
  } catch (error) {
    memoizedOptionSetter("kabupaten", {
      data: [],
      loading: false,
      error: true
    })
  }
}

export const getKecamatan = async (memoizedOptionSetter, kabupatenId) => {
  memoizedOptionSetter("kecamatan", {
    data: [],
    loading: true
  })

  try {
    const result = await Axios.get(`/sample/kecamatan`, {
      params: {
        id: kabupatenId
      }
    })
    memoizedOptionSetter("kecamatan", {
      data: result.data?.data?.map((item) => ({
        value: item.id,
        label: item.nama.toUpperCase(),
        ...item
      })),
      loading: false
    })
  } catch (error) {
    memoizedOptionSetter("kecamatan", {
      data: [],
      loading: false,
      error: true
    })
  }
}

export const getDesa = async (memoizedOptionSetter, kecamatanId) => {
  memoizedOptionSetter("desa", {
    data: [],
    loading: true
  })

  try {
    const result = await Axios.get(`/sample/desa`, {
      params: {
        id: kecamatanId
      }
    })
    memoizedOptionSetter("desa", {
      data: result.data?.data?.map((item) => ({
        value: item.id,
        label: item.nama.toUpperCase(),
        ...item
      })),
      loading: false
    })
  } catch (error) {
    memoizedOptionSetter("desa", {
      data: [],
      loading: false,
      error: true
    })
  }
}
