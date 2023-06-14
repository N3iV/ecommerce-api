const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access/index"));

// router.get("/", (req, res) => {
//   return res.status(200).json({k
//     message: "Welcome",
//   });
// });

module.exports = router;
