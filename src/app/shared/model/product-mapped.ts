export class ProductMapped {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  image: string;
  category: string;
  categoryId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    cost: number,
    price: number,
    stock: number,
    image: string,
    category: string,
    categoryId: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.price = price;
    this.stock = stock;
    this.image = image;
    this.category = category;
    this.categoryId = categoryId;
  }
}