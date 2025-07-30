const getStatusPengusulan = (data) => {
  let currentStep = "terkirim";
  const steps = [
    {
      id: "terkirim",
      title: "Terkirim",
    },
    {
      id: "verifikasi-admin",
      title: "Vermin",
    },
    {
      id: "verifikasi-teknis",
      title: data?.DirektoratId === 4 ? "Verlok" : "Vertek",
    },
    {
      id: "penetapan",
      title: "Penetapan",
    },
    {
      id: "pembangunan",
      title: "Capaian Pembangunan",
    },
    {
      id: "serah-terima",
      title: "Serah Terima",
    },
  ];
  if (data.statusTerkirim === "terkirim" && data.statusVerminId !== null) {
    currentStep = "verifikasi-admin";
  }
  if (data.statusVermin === 1 && data.statusVertekId !== null) {
    currentStep = "verifikasi-teknis";
  }
  if (data.statusVertek === 1 && data.statusPenetapanId !== null) {
    currentStep = "penetapan";
  }
  if (data.statusPembangunan !== undefined && data.statusPembangunan !== null) {
    currentStep = "pembangunan";
  }
  if (data.statusSerahTerima !== null) {
    currentStep = "serah-terima";
  }

  function getCurrentStatusData(currentStep) {
    const step = steps.find((step) => step.id === currentStep);
    let status = "waiting";
    if (currentStep === "terkirim") {
      if (data.statusTerkirim === "belum terkirim") {
        status = "processing";
      }
      if (data.statusTerkirim === "revisi") {
        status = "revision";
      }
      if (data.statusTerkirim === "terkirim") {
        status = "finish";
      }
    }
    if (currentStep === "verifikasi-admin") {
      if (data.statusVermin === null) {
        status = "processing";
      }
      if (data.statusVermin === 0) {
        status = "revision";
      }
      if (data.statusVermin === 1) {
        status = "finish";
      }
    }
    if (currentStep === "verifikasi-teknis") {
      if (data.statusVertek === null) {
        status = "processing";
      }
      if (data.statusVertek === 0) {
        status = "revision";
      }
      if (data.statusVertek === 1) {
        status = "finish";
      }
    }
    if (currentStep === "penetapan") {
      if (data.statusPenetapan === null) {
        status = "processing";
      }
      if (data.statusPenetapan === 0) {
        status = "revision";
      }
      if (data.statusPenetapan === 1) {
        status = "finish";
      }
    }
    if (currentStep === "pembangunan") {
      if (data.statusPembangunan === null) {
        status = "processing";
      }
      if (data.statusPembangunan === 0) {
        status = "revision";
      }
      if (data.statusPembangunan === 1) {
        status = "finish";
      }
    }
    if (currentStep === "serah-terima") {
      if (data.statusSerahTerima === null) {
        status = "processing";
      }
      if (data.statusSerahTerima === 0) {
        status = "revision";
      }
      if (data.statusSerahTerima === 1) {
        status = "finish";
      }
    }
    return {
      label: step?.title ?? "-",
      status,
    };
  }
  const indexCurrentStep = steps.findIndex((step) => step.id === currentStep);
  return {
    steps: steps.map((step, index) => {
      let result = indexCurrentStep > index ? "finish" : "waiting";
      if (currentStep === step.id) {
        result = getCurrentStatusData(currentStep).status;
      }
      return {
        ...step,
        status: result,
      };
    }),
    currentStep: getCurrentStatusData(currentStep),
  };
};

export default getStatusPengusulan;
