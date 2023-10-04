export class PaginationDto {
  data: any[];
  page: string;
  pages: number;
  next: string | null;
  previous: string | null;
  total: number;
}
