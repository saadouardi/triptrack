import { DataTypes, Model, type Optional, type Sequelize } from "sequelize"
import type { Trip } from "../types/trip.types"

interface TripCreationAttributes extends Optional<Trip, "id" | "createdAt" | "updatedAt"> {}

export class TripModel extends Model<Trip, TripCreationAttributes> implements Trip {
  public id!: string
  public name!: string
  public description!: string
  public startDate!: Date
  public endDate!: Date
  public image?: string
  public participants?: string[]
  public createdAt!: Date
  public updatedAt!: Date

  public static initialize(sequelize: Sequelize): void {
    TripModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        participants: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "trips",
        timestamps: true,
      },
    )
  }
}
