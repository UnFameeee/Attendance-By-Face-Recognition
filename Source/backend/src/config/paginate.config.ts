export class Page {
  page: number;
  pageSize: number;
  totalElement?: number;
}

export class Paging <T> {
    data: T;
    page: Page;
}

export const paginate = (page: Page) => {
  const offset = page.page * page.pageSize;
  const limit = page.pageSize;

  return {
    skip: offset,
    take: limit
  }
}
