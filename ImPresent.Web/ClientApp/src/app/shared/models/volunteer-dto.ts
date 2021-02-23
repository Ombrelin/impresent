import { DayDto, StudentDto } from './model';

export interface VolunteerDto {
    presenceDay: DayDto;
    student: StudentDto;
    id: string;
}
