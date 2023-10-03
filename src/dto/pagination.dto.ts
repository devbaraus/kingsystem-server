export class PaginationDto {
  results: any[];
  page: string;
  pages: number;
  next: string | null;
  previous: string | null;
  total: number;
}
