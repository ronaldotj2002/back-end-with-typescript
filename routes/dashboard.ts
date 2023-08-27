import * as express from "express";
import moment from "moment";
const dashboard = express.Router();

dashboard.get('/usuarios', async (req, res) => {
    const labels: any[] = [];
    res.json({
        labels,
        dataset: [
            {
                label: "Usuários",
                data: [10, 20, 30, 40, 50, 60, 70, 80, 100],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000",
                fill: false,
            }
        ]
    })
});
dashboard.get('/gastos', async (req, res) => {
    const labels: any[] = [];
    res.json({
        labels,
        dataset: [
            {
                label: "Gastos",
                data: [10, 20, 30, 40, 50, 60, 70, 80, 100],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000",
                fill: false,
            }
        ]
    })
});

export default dashboard;