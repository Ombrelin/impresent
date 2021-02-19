import { Student } from './students';

export interface Promotion {
  id: string;
  className: string;
  students: Array<Student>;
}
