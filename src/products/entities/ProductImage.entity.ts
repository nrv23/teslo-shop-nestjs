import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
    name:"product_images"
})
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "varchar",
        length: 500
    })
    url: string;

    @ManyToOne(
        () => Product,
        product => product.images,
        {
            onDelete: "CASCADE"
        }
    )
    product: Product;
}