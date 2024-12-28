const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getPropertiesByType,
  getPropertiesByUse,
  buyProperty,
  changeViewCount,
  getAllViews,
} = require("../controllers/propertyCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
// const { uploadImages } = require("../middlewares/uploadImages");

// Public routes
router.get("/all-views", getAllViews);
router.get("/all-properties", getAllProperties);
router.get("/type/:typeId", getPropertiesByType);
router.get("/use/:use", getPropertiesByUse);
router.get("/users-properties", authMiddleware, getUserProperties);
router.get("/:id", getProperty);

// Protected routes
router.use(authMiddleware);
router.post("/change-view", changeViewCount);
router.post("/create-property", createProperty);
router.put("/update-property", updateProperty);
router.delete("/delete-property", deleteProperty);
router.post("/buy-property", authMiddleware, buyProperty);

module.exports = router;
