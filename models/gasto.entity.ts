import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface Despesa {
    id: number;
    titulo: string;
    descricao: string;
    valor: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;

}

export type UserCreationAttributes = Optional<Despesa, 'id'>;


export class Gasto extends Model<Despesa, UserCreationAttributes> implements Despesa  {
    public id!: number;
    public titulo!: string;
    public descricao!: string;
    public valor!: number;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Gasto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: { 
        type: new DataTypes.STRING(50),
        allowNull: false
    },
    descricao: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    valor: { 
        type: new DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    createdAt: {
        type: new DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: new DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
},
    {
        sequelize,
        tableName: 'gastos',
        modelName: 'gasto'
    }
)