import { ApiResponse, BaseService, Body, GET, Header, Path, POST, ServiceBuilder } from 'ts-retrofit2';
import { API_URL } from 'src/app/core/constants/api-constants';
import {
  AuthDto,
  AuthToken,
  AddPromotionDto,
  AddStudentDto,
  PromotionDto,
  StudentDto,
  AddDayDto,
  DayDto,
  VolunteerDto,
  AddVolunteerDto
} from 'src/app/shared/models/model';

class ApiService extends BaseService {

  @POST('/auth')
  async auth(@Body auth: AuthDto): Promise<ApiResponse<AuthToken>> { return {} as Promise<ApiResponse<AuthToken>>; }

  @POST('/promotions')
  addPromotion(@Body promotion: AddPromotionDto): ApiResponse<PromotionDto> { }

  @POST('/promotions/{id}/students')
  addStudent(
    @Header('Authorization') authorization: string,
    @Path('id') id: string,
    @Body student: AddStudentDto
  ): ApiResponse<StudentDto> { }

  @GET('/promotions/{id}')
  getPromotion(
    @Path('id') id: string
  ): ApiResponse<PromotionDto> { }

  @POST('/promotions/{id}/days')
  addDay(
    @Header('Authorization') authorization: string,
    @Path('id') id: string,
    @Body day: AddDayDto
  ): ApiResponse<DayDto> { }

  @POST('/promotions/{promoId}/days/{dayId}/volunteers')
  addVolunteer(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
    @Body day: AddVolunteerDto
  ): ApiResponse<VolunteerDto> { }

  @GET('/promotions/{promoId}/days/{dayId}/volunteers')
  getVolunteers(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
  ): ApiResponse<Array<VolunteerDto>> { }
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
