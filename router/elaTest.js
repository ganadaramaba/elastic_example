
const express = require("express");
const router = express.Router();
const es = require("es7");
const INDEX = "fortest"; // index는 대문자 안됨
const config = {
    node: "http://localhost:9200/" // http:// 이거 빼니까 에러남
};

// 모두 가져오기
router.get("", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.search({
            index: INDEX,
            body: {
                query: {
                    match_all: {}
                }
            },
            size: 999
        });
        result.esResult = temp.body.hits.hits
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// 연결 상태 확인
router.get("/status", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        result.esResult = await client.ping();
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nping err");
        console.log(err);
    }

    res.send(result);
});

// 데이터 입력
router.post("", async (req, res) => {
    const receive = {
        num: req.body.num,
        str: req.body.str,
        list: req.body.list
    }
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    console.log("\nusing async/await\n");
    try {
        result.esResult = await client.index({
            index: INDEX,
            body: {
                num: receive.num,
                str: receive.str,
                list: req.body.list
            }
        });
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\ninsert err");
        console.log(err);
    }

    res.send(result);
})

// 특정 조건으로 삭제
router.delete("", async (req, res) => {
    const receive = {
        num: req.body.num
    }
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    // async/await 방식
    console.log("\nusing async/await\n");
    try {
        result.esResult = await client.deleteByQuery({
            index: INDEX,
            body: {
                query: {
                    match: {
                        num: receive.num
                    }
                }
            }
        });
        result.success = true;
        console.log("\ndelete success");
    }
    catch(err) {
        result.success = false;
        console.log("\ndelete err");
        console.log(err);
    }

    res.send(result);
})

module.exports = router;