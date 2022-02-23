import express from "express";
import path from "path";

const app = express();
const port = 5000;

app.use(express.static('dashboard/client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve('dashboard/client/build/index.html'));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));