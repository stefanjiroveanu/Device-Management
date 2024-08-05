import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "devices_values", database: "devices_values" })
export class DeviceMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "device_uuid" })
  deviceUuid: string;

  @Column({ name: "timestamp" })
  timestamp: string;

  @Column({ name: "measurement_value", type:"double precision" })
  measurementValue: number;
}
