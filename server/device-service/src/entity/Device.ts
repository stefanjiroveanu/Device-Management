import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "devices", database: "devices" })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({name: "device_name"})  
  name: string;

  @Column({name: "device_address"})
  address: string;

  @Column({name: "device_description"})
  description: string;

  @Column({name: "max_energy_consumption"})
  maxEnergyConsumption: number;

  @Column({name: "owner_id"}) 
  userUuid: string;
}
