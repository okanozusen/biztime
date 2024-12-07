const express = require('express');
const router = new express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: result.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoiceResult = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id = $1`,
            [id]
        );

        if (invoiceResult.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        const invoice = invoiceResult.rows[0];

        const companyResult = await db.query(
            `SELECT code, name, description FROM companies WHERE code = $1`,
            [invoice.comp_code]
        );

        invoice.company = companyResult.rows[0];
        delete invoice.comp_code; 

        return res.json({ invoice });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;

        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
             VALUES ($1, $2, false, CURRENT_DATE, null)
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );

        return res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
      const { amt, paid } = req.body;
  
      const invoiceResult = await db.query(
        `SELECT paid, paid_date FROM invoices WHERE id = $1`,
        [req.params.id]
      );
  
      if (invoiceResult.rows.length === 0) {
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      const { paid: currentPaid, paid_date: currentPaidDate } = invoiceResult.rows[0];
      let paidDate = currentPaidDate;
  
      if (!currentPaid && paid) {
        paidDate = new Date();
      } else if (currentPaid && !paid) {
        paidDate = null;
      }
  
      const result = await db.query(
        `UPDATE invoices
         SET amt = $1, paid = $2, paid_date = $3
         WHERE id = $4
         RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [amt, paid, paidDate, req.params.id]
      );
  
      return res.json({ invoice: result.rows[0] });
    } catch (err) {
      return next(err);
    }
  });
  

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `DELETE FROM invoices WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        return res.json({ status: "deleted" });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
