import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity('species')
export class Species {
    @PrimaryGeneratedColumn('uuid')
    species_id: string;

    @Column('text')
    name:string;

    @Column('text')
    descripcion: string;

    @OneToMany(() => Animal, (animal) => animal.species)
    animals: Animal[];

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
      })
      created_at: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
      })
      updated_at: Date;
}