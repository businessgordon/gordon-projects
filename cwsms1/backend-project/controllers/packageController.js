const { getPackages, getPackageByNumber, createPackage, updatePackage, deletePackage } = require('../models/packageModel');

async function listPackages(req, res) {
  const { search = '' } = req.query;
  const packages = await getPackages(search);
  res.json(packages);
}

async function getPackage(req, res) {
  const pkg = await getPackageByNumber(req.params.package_number);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  res.json(pkg);
}

async function createNewPackage(req, res) {
  const { package_name, package_description, package_price } = req.body;
  if (!package_name || !package_price) {
    return res.status(400).json({ message: 'Package name and price are required' });
  }
  await createPackage({ package_name, package_description, package_price });
  res.status(201).json({ message: 'Package created' });
}

async function updateExistingPackage(req, res) {
  await updatePackage(req.params.package_number, req.body);
  res.json({ message: 'Package updated' });
}

async function deleteExistingPackage(req, res) {
  await deletePackage(req.params.package_number);
  res.json({ message: 'Package deleted' });
}

module.exports = { listPackages, getPackage, createNewPackage, updateExistingPackage, deleteExistingPackage };
