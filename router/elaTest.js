
const express = require("express");
const router = express.Router();
const es = require("es7");
const INDEX = "fortest"; // index는 대문자 안됨
const config = {
    // node만 사용하면 보안 없이 연결
    node: "http://localhost:9200/", // http:// 이거 빼니까 에러남

    // cloud: { // elastic cloud 사용시 씀.
    //     id: '<cloud-id>'
    // },
    // auth: { // 보안 관련. 여러 보안 방법이 있음
    //     username: 'elastic',
    //     password: 'changeme',
    //     apiKey: 'base64EncodedKey'
    // },
    // tls: {
    //     ca: fs.readFileSync('./http_ca.crt'),
    //     rejectUnauthorized: false
    // },
    // caFingerprint: '20:0D:CA:FA:76:...',
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

// indices 정보 확인
router.get("/get_indices", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.indices.get({index: INDEX});
        console.log("result:", temp);
        result.esResult = temp;
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// data stream 정보 확인
router.get("/get_data_stream", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.indices.getDataStream();
        console.log("result:", temp);
        result.esResult = temp;
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// ?? 정보 확인
router.get("/info", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.info();
        console.log("result:", temp);
        result.esResult = temp;
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// 노드 정보 확인
router.get("/node_info", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.nodes.info();
        console.log("result:", temp);
        result.esResult = temp;
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// stat API.
router.get("/stats", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.indices.stats();
        console.log("result:", temp);
        result.esResult = temp;
        result.success = true;
    }
    catch(err) {
        result.success = false;
        console.log("\nsearch err");
        console.log(err);
    }
    res.send(result);
});

// get_mapping API. 
router.get("/get_mapping", async (req, res) => {
    const result = {
        success: null,
        esResult: null
    }

    const client = new es.Client(config);

    try {
        const temp = await client.indices.getMapping();
        console.log("result:", temp);
        result.esResult = temp;
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

// curl -XPOST localhost:3000/elaTest -H 'Content-Type: application/json' -d '{"num": 3, "str": "abc", "list": ["abc", 3]}'
// 결과 - {"success":false,"esResult":null}

// curl -XPOST localhost:3000/elaTest -H 'Content-Type: application/json' -d '{"num": 3, "str": "abc", "list": ["abc", "def"]}'
// 결과 - {"success":true,"esResult":{"body":{"_index":"fortest","_type":"_doc","_id":"6KWVV4EB6CFAEp6K4F8j","_version":1,"result":"created","_shards":{"total":2,"successful":2,"failed":0},"_seq_no":0,"_primary_term":1},"statusCode":201,"headers":{"location":"/fortest/_doc/6KWVV4EB6CFAEp6K4F8j","x-elastic-product":"Elasticsearch","warning":"299 Elasticsearch-7.17.4-79878662c54c886ae89206c685d9f1051a9d6411 \"Elasticsearch built-in security features are not enabled. Without authentication, your cluster could be accessible to anyone. See https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-minimal-setup.html to enable security.\"","content-type":"application/json; charset=UTF-8","content-length":"174"},"meta":{"context":null,"request":{"params":{"method":"POST","path":"/fortest/_doc","body":"{\"num\":3,\"str\":\"abc\",\"list\":[\"abc\",\"def\"]}","querystring":"","headers":{"user-agent":"elasticsearch-js/7.17.0 (linux 5.13.0-1025-aws-x64; Node.js v14.19.0)","x-elastic-client-meta":"es=7.17.0,js=14.19.0,t=7.17.0,hc=14.19.0","content-type":"application/json","content-length":"42"},"timeout":30000},"options":{},"id":1},"name":"elasticsearch-js","connection":{"url":"http://localhost:9200/","id":"http://localhost:9200/","headers":{},"deadCount":0,"resurrectTimeout":0,"_openRequests":0,"status":"alive","roles":{"master":true,"data":true,"ingest":true,"ml":false}},"attempts":0,"aborted":false}}}

// 리스트에 다른 타입이 들어가면 에러가 나는 듯.

// curl -XGET localhost:3000/elaTest
// 결과 - {"success":true,"esResult":[{"_index":"fortest","_type":"_doc","_id":"6KWVV4EB6CFAEp6K4F8j","_score":1,"_source":{"num":3,"str":"abc","list":["abc","def"]}}]}

// path parameters
// 경로에 매개변수 넣는 거. elasticsearch docs에서 이 단어로 표현함.
// https://www.elastic.co/guide/en/elasticsearch/reference/master/search-search.html#search-search-api-path-params

// mapping - 일종의 자료구조? document의 구조.