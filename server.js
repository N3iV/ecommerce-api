const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(
    "WSV ecommerce server is running on port: " + server.address().port
  );
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server"));
});
