const express = require("express");
const router = new express.Router();
const db = require("../db");

// Add a new industry
router.post("/", async (req, res, next) => {
  try {
    const { code, industry } = req.body;

    const result = await db.query(
      `INSERT INTO industries (code, industry)
       VALUES ($1, $2)
       RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// List all industries with associated companies
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT i.code, i.industry, 
              ARRAY_AGG(ci.company_code) AS companies
       FROM industries i
       LEFT JOIN company_industries ci ON i.code = ci.industry_code
       GROUP BY i.code, i.industry`
    );

    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// Associate a company with an industry
router.post("/:code/companies", async (req, res, next) => {
  try {
    const { companyCode } = req.body;
    const { code } = req.params;

    const result = await db.query(
      `INSERT INTO company_industries (company_code, industry_code)
       VALUES ($1, $2)
       RETURNING company_code, industry_code`,
      [companyCode, code]
    );

    return res.status(201).json({ association: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
