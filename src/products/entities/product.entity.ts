import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./ProductImage.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: "products"
})
export class Product {

    @ApiProperty({
        description: "Product id must be uuid",
        uniqueItems: true
    }) // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column('varchar', {
        unique: true
    })
    title: string;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column("decimal", {
        default: 0
    })
    price: number;


    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column({
        type: "varchar",
        length: 500,
        nullable: true
    })
    description: string;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column({
        type: "varchar",
        unique: true,
        nullable: true,
        length: 500
    })
    slug: string;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column({
        type: "int",
        default: 0

    })
    stock: number;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column({
        type: "varchar",
        array: true
    })
    sizes: string[];

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
    @Column({
        type: "varchar"
    })
    gender: string;

    @ApiProperty() // lo usa swuagger para documentar el valor de retorno en los controladores de rutas
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
