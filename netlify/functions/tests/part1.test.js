const LambdaTester = require("lambda-tester");
const myHandler = require("part1").handler;
describe("handler", function () {
  it("returns 200 on GET with family name", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "GET",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(200);
      });
  });

  it("returns 400 on GET with bad family name", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "GET",
        queryStringParameters: { family_common_name: 'null' },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.body)).toEqual({ message: "no plants found for this common family name" });
      });
  });

  it("returns 405", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "POST",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(405);
      });
  });

  it("returns 405", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "PUT",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(405);
      });
  });

  it("returns 405", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "DELETE",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(405);
      });
  });
});
