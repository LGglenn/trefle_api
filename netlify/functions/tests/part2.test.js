const LambdaTester = require("lambda-tester");
const myHandler = require("part2").handler;
describe("handler", function () {
  it("returns 200 on GET with family name", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "GET",
        queryStringParameters: { family_common_name: "Olive family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body).message).toEqual("success");
      });
  });

  it("returns 400 on GET with bad family name", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "GET",
        queryStringParameters: { family_common_name: 'not a family name' },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.body)).toEqual({ message: "no plants found for this common family name" });
      });
  });

  it("returns 405 for POST", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "POST",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(405);
      });
  });

  it("returns 405 for PUT", async function () {
    await LambdaTester(myHandler)
      .event({
        httpMethod: "PUT",
        queryStringParameters: { family_common_name: "Rose family" },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toEqual(405);
      });
  });

  it("returns 405 for DELETE", async function () {
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
