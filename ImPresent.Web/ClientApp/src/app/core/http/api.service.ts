import { 
  ApiResponse, 
  BaseService, 
  Body, 
  GET, 
  Header, 
  Multipart, 
  Part, 
  Path, 
  POST, 
  ServiceBuilder
} from 'ts-retrofit2';
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
  AddVolunteerDto,
  DayVolunteerDto
} from 'src/app/shared/models/model';
import { PartDescriptor } from 'ts-retrofit2/dist/constants';

class ApiService extends BaseService {

  @POST('/auth')
  auth(@Body auth: AuthDto): ApiResponse<AuthToken> { }

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
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
    @Body day: AddVolunteerDto
  ): ApiResponse<StudentDto> { }

  @GET('/promotions/{promoId}/days/{dayId}/volunteers')
  getVolunteers(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
  ): ApiResponse<DayVolunteerDto> { }

  @GET('/promotions/{promoId}/days/{dayId}/designated')
  getDesignated(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
  ): ApiResponse<Array<StudentDto>> { }

  @POST('/promotions/{promoId}/days/{dayId}/validate')
  validate(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Path('dayId') dayId: string,
    @Body ids: string[]
  ): ApiResponse { }

  @POST('/promotions/{promoId}/import')
  @Multipart
  importStudents(
    @Header('Authorization') authorization: string,
    @Path('promoId') promoId: string,
    @Part('students') csv: PartDescriptor<File>
  ): ApiResponse { }
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
