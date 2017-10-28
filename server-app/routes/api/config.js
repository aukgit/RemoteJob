const express = require('express');
const router = express.Router();

router.get('/config', (req, res) => {
  res.send({
    type: 'GET'
  });
});

router.post('/config', (req, res) => {
  res.send({
    type: 'POST'
  });
});

router.put('/config/:id', (req, res) => {
  res.send({
    type: 'PUT'
  });
});

router.delete('/config/:id', (req, res) => {
  res.send({
    type: 'DELETE'
  });
});

module.exports = router;
