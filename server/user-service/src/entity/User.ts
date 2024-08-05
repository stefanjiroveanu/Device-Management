import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "users", database: "appusers" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  username: string;

  @Column()
  email:string;

  @Column()
  password: string;

  @Column()
  role: string;
}
