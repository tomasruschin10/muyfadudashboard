export interface PaginatedEp<T> {
  data: T;
  meta: Meta;
}

export interface Meta {
  current_page:   number;
  per_page:       number;
  total_pages:    number;
  total_elements: number;
  next_page:      number;
  previous_page:  null;
}