import DBClientManager from '@data/access/DBClientManager';
import IService from './IService';
import IProduct from '@data/interfaces/IProduct';

export class ProductService implements IService<IProduct> {
  private static instance: IService<IProduct>;
  private clientManager: DBClientManager;

  private constructor() {
    this.clientManager = DBClientManager.getInstance();
  }

  static getInstance(): IService<IProduct> {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getAll(): Promise<IProduct[]> {
    const { rows: products } = await this.clientManager
      .getClient()
      .query(
        'SELECT products.*, stocks.count FROM products INNER JOIN stocks ON stocks.product_id = products.id'
      );

    return products;
  }

  async getById(id: string): Promise<IProduct> {
    const {
      rows: [product]
    } = await this.clientManager
      .getClient()
      .query(
        'SELECT products.*, stocks.count FROM products INNER JOIN stocks ON stocks.product_id = products.id WHERE id = $1',
        [id]
      );

    return product;
  }

  async create(data: Omit<IProduct, 'id'>): Promise<IProduct> {
    const client = this.clientManager.getClient();

    try {
      await client.query('BEGIN');

      const {
        rows: [insertedProduct]
      } = await client.query(
        'INSERT INTO products(title, description, price, "imgUrl", ram, storage, display) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [
          data.title,
          data.description,
          data.price,
          data.imgUrl,
          data.ram,
          data.storage,
          data.display
        ]
      );

      await client.query('INSERT INTO stocks(product_id, count) VALUES ($1, $2)', [
        insertedProduct.id,
        data.count
      ]);

      await client.query('COMMIT');

      return {
        id: insertedProduct.id,
        ...data
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    }
  }
}

export default ProductService.getInstance();
