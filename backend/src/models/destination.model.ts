import { DataTypes, Model, type Optional, type Sequelize } from "sequelize"
import type { Destination } from "../types/destination.types"

interface DestinationCreationAttributes extends Optional<Destination, "id" | "createdAt" | "updatedAt"> {}

export class DestinationModel extends Model<Destination, DestinationCreationAttributes> implements Destination {
  public id!: string
  public name!: string
  public description!: string
  public startDate?: Date
  public endDate?: Date
  public activities?: string[]
  public photos?: string[]
  public location?: string
  public createdAt!: Date
  public updatedAt!: Date

  public static initialize(sequelize: Sequelize): void {
    DestinationModel.init(
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
          allowNull: true,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        activities: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        photos: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        location: {
          type: DataTypes.STRING,
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
        tableName: "destinations",
        timestamps: true,
      },
    )
  }
}
