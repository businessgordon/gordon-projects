const { getServices, getService, createService, updateService, deleteService } = require('../models/serviceModel');

async function listServices(req, res) {
  const { search = '', page = 1, limit = 10 } = req.query;
  const data = await getServices(search, page, limit);
  res.json(data);
}

async function getServiceRecord(req, res) {
  const service = await getService(req.params.record_number);
  if (!service) return res.status(404).json({ message: 'Service record not found' });
  res.json(service);
}

async function createServiceRecord(req, res) {
  const { plate_number, package_number, service_date, status = 'Pending' } = req.body;
  if (!plate_number || !package_number || !service_date) {
    return res.status(400).json({ message: 'Plate number, package and date are required' });
  }
  const id = await createService({ plate_number, package_number, service_date, status });
  res.status(201).json({ message: 'Service created', record_number: id });
}

async function updateServiceRecord(req, res) {
  await updateService(req.params.record_number, req.body);
  res.json({ message: 'Service updated' });
}

async function deleteServiceRecord(req, res) {
  await deleteService(req.params.record_number);
  res.json({ message: 'Service removed' });
}

module.exports = { listServices, getServiceRecord, createServiceRecord, updateServiceRecord, deleteServiceRecord };
