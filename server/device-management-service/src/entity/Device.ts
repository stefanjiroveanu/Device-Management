import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "devices", database: "devices_values" })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "device_uuid" })
  deviceUuid: string;

  @Column({ name: "max_energy_consumption", type:"double precision" })
  maxEnergyConsumption: number;

  @Column({ name: "owner_id" })
  userUuid: string;
}
