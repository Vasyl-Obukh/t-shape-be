export default interface IService<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T> | null;
  create(data: Omit<T, 'id'>): Promise<T>;
}
