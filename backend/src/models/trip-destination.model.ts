import { DataTypes, Model, type Optional, type Sequelize } from "sequelize"
import { TripModel } from "./trip.model"
import { DestinationModel } from "./destination.model"

interface TripDestination {
  id: string
  tripId: string
  destinationId: string
  order?: number
}

interface TripDestinationCreationAttributes extends Optional<TripDestination, "id"> {}

export class TripDestinationModel
  extends Model<TripDestination, TripDestinationCreationAttributes>
  implements TripDestination
{
  public id!: string
  public tripId!: string
  public destinationId!: string
  public order?: number

  public static initialize(sequelize: Sequelize): void {
    TripDestinationModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        tripId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "trips",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        destinationId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "destinations",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "trip_destinations",
        timestamps: false,
      },
    )
  }

  public static associate(): void {
    TripModel.belongsToMany(DestinationModel, {
      through: TripDestinationModel,
      foreignKey: "tripId",
      otherKey: "destinationId",
    })

    DestinationModel.belongsToMany(TripModel, {
      through: TripDestinationModel,
      foreignKey: "destinationId",
      otherKey: "tripId",
    })
  }
}
