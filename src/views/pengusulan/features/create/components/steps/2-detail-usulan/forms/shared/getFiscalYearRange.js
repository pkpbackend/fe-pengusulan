function getFiscalYearRange(tanggalSurat) {
  const tahunFirst = tanggalSurat.getFullYear();
  return [
    {
      value: tahunFirst,
      label: tahunFirst,
    },
    {
      value: tahunFirst + 1,
      label: tahunFirst + 1,
    },
  ];
}

export { getFiscalYearRange };
