import { DayDto } from './day-dto';
import { StudentDto } from './students';

export interface PromotionDto {
  id: string;
  className: string;
  students: Array<StudentDto>;
  presenceDays: Array<DayDto>;
}
