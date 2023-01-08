export interface CreateBookDto {
  name?: string;
  author?: string;
  vendorCode?: string;
  publishedDate: Date;
  commonCount: number;
}
