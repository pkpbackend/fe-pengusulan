const getKonregPoolStatus = (data) => {
  let status = "Belum";
  if (
    data.anggaran !== null &&
    data.kroId !== null &&
    data.uraian !== null &&
    data.siproId !== null
  ) {
    status = "Sync";
  } else if (
    data.anggaran !== null &&
    data.kroId !== null &&
    data.uraian !== null
  ) {
    status = "Pool";
  }

  return status;
};

export default getKonregPoolStatus;
