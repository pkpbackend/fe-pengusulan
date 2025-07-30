const ENV = process.env.REACT_APP_NODE_ENV || "development";

export const BACKEND_BASE_URL = {
  development: "http://localhost:8000",
  staging: "https://api-sibaruv3.ujiaplikasi.com",
  prod: "https://sibaru.perumahan.pu.go.id/api",
  "prod-nodomain": "http://10.130.20.111/api",
}[ENV];

export const BACKEND_BASE_URLV3 = {
  development: "http://localhost:8000",
  staging: "https://api-sibaruv3.ujiaplikasi.com",
  prod: "https://sibaru.perumahan.pu.go.id/api",
  "prod-nodomain": "http://10.130.20.111/api",
}[ENV];

export const ASSET_URL = {
  development: "https://sibaru.s3.ap-southeast-1.amazonaws.com/sibaru",
  staging: "https://sibaru.s3.ap-southeast-1.amazonaws.com/sibaru",
  prod: "https://sibaru.perumahan.pu.go.id/static",
  "prod-nodomain": "http://10.130.20.111/api",
}[ENV];
