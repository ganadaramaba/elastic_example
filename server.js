
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const elaTest = require("./router/elaTest");
app.use("/elaTest", elaTest);

app.listen(port, (req, res) => {
    console.log(port, "번에 실행");
});
