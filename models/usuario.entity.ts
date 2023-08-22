import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";


interface Usu {
    id: number;
    nome: string;
    email: string;
    login: string;
    senha: string;
    createdAt?: Date;
    updatedAt?: Date;

}

export type UserCreationAttributes = Optional<Usu, 'id'>;


export class User extends Model<Usu, UserCreationAttributes> {

    declare id: number | null;
    declare nome: string | null;
    declare email: string | null;
    declare login: string | null;
    declare senha: string | null;
    declare createdAt: Date | null;
    declare updatedAt: Date | null;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: { 
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: new DataTypes.STRING(70),
        allowNull: false,
        unique: true
    },
    login: { 
        type: new DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    senha: {
        type: new DataTypes.STRING(256),
        allowNull: false
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
        tableName: 'usuarios',
        modelName: 'usuario'
    }
)

