import { DayDto, StudentDto } from "./model";

export interface DayVolunteerDto {
    presenceDay: DayDto;
    students: StudentDto[];
}