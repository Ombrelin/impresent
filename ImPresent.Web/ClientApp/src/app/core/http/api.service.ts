import { BaseService, GET, ServiceBuilder } from "ts-retrofit2";

import { API_URL } from "src/app/core/constants/api-constants";


class ApiService extends BaseService {

  @GET('/void')
  getVoid(): void { }
}

function createApiService(): ApiService {
  const service = new ServiceBuilder()
    .baseUrl(API_URL)
    .setTimeout(4000)
    .build(ApiService);

  return service;
}

export {
  ApiService,
  createApiService
};