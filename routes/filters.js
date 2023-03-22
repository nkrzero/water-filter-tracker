const express = require('express');
const Filter = require('../models/Filter');

const router = express.Router();

function calculateExpirationDate(filterName, installDate) {
  const expDate = new Date(installDate);
  if (['SED', 'GAC', 'ACB'].includes(filterName)) {
    expDate.setMonth(expDate.getMonth() + 6);
  } else if (['ROM', 'PAC'].includes(filterName)) {
    expDate.setFullYear(expDate.getFullYear() + 1);
  }
  return expDate.toISOString().split('T')[0];
}

router.get('/', async (req, res) => {
  const filters = await Filter.find({});
  let systemInstallDate = new Date('2022-11-01');

  if (filters.length > 0) {
    systemInstallDate = filters[0].installDate;
  }

  res.render('index', {
    title: 'Water Filter Tracker',
    systemInstallDate: systemInstallDate.toISOString().split('T')[0],
    filters: filters,
    calculateExpirationDate: calculateExpirationDate
  });
});

router.post('/updateInstallDate', async (req, res) => {
  const filterName = req.body.filterName;
  const newInstallDate = new Date(req.body.newInstallDate);

  await Filter.updateOne({ name: filterName }, { installDate: newInstallDate });
  res.sendStatus(200);
});

router.post('/resetInstallDate', async (req, res) => {
  const filterName = req.body.filterName;
  const filter = await Filter.findOne({ name: filterName });
  const systemInstallDate = filter.first_installed;

  await Filter.updateOne({ name: filterName }, { installDate: systemInstallDate });
  res.json({ newInstallDate: systemInstallDate.toISOString().split('T')[0] });
});

router.post('/updateSystemInstallDate', async (req, res) => {
  const newSystemInstallDate = new Date(req.body.newSystemInstallDate);

  for (const filterName of ['ACB', 'GAC', 'SED', 'PAC', 'ROM']) {
    await Filter.updateOne(
      { name: filterName },
      {
        installDate: newSystemInstallDate,
        first_installed: newSystemInstallDate
      }
    );
  }

  res.sendStatus(200);
});

module.exports = router;
