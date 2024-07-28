import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./ProductImage.entity";
import { User } from "../../auth/entities/user.entity";

@Entity({
    name: "products"
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true
    })
    title: string;

    @Column("decimal", {
        default: 0
    })
    price: number;


    @Column({
        type: "varchar",
        length: 500,
        nullable: true
    })
    description: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: true,
        length: 500
    })
    slug: string;

    @Column({
        type: "int",
        default: 0

    })
    stock: number;

    @Column({
        type: "varchar",
        array: true
    })
    sizes: string[];

    @Column({
        type: "varchar"
    })
    gender: string;

    @Column({
        type: "varchar",
        array: true,
        default: []
    })
    tags: string[];

    //images 
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true // trae todos los registros que tenga relacion con esta entidad donde esta entidad sea la tabla padre 
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        user => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert() // hooks de typeorm
    checkSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLocaleLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "");
    }


    @BeforeUpdate() // hooks de typeorm
    checkSlugUpdate() {

        this.slug = this.slug.toLocaleLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "");
    }
}
