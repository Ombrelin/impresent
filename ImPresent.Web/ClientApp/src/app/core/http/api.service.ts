import { ApiResponse, BaseService, Body, GET, Path, POST, ServiceBuilder } from 'ts-retrofit2';

import { API_URL } from 'src/app/core/constants/api-constants';
import {
  AuthDto,
  AuthToken,
  AddPromotionDto,
  AddStudentDto,
  Promotion,
  Student
} from 'src/app/shared/models/model';

class ApiService extends BaseService {

  @POST('/auth')
  async auth(@Body auth: AuthDto): Promise<ApiResponse<AuthToken>> { return {} as Promise<ApiResponse<AuthToken>>; }

  @POST('/promotions')
  addPromotion(@Body promotion: AddPromotionDto): ApiResponse<Promotion> { }

  @POST('/promotions/{id}/students')
  addStudent(@Path('id') id: string, @Body student: AddStudentDto): ApiResponse<Student> { }

  @GET('/promotions/{id}')
  getStudent(@Path('id') id: string): ApiResponse<Promotion> { }
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
