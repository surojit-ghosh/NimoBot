import express from "express";
import path from "path";
import chalk from "chalk";

const app = express();
const port = 3000;

app.use(express.static('dashboard/client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve('dashboard/client/build/index.html'));
});

app.listen(port, () => console.log(chalk.bgGreen(` [Server] `) + chalk.green(` running at http://localhost:${port}`)));