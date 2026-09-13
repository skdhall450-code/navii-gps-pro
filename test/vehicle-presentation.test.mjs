import assert from 'node:assert/strict';
import test from 'node:test';
import { VEHICLE_TYPE_OPTIONS, getVehicleIconSvg, normalizeVehicleType, getVehicleTypeLabel, formatSimNumber } from '../lib/vehicle-presentation.ts';

test('every vehicle selection has a distinct marker, including scooter and EV scooter', () => {
  assert.equal(new Set(VEHICLE_TYPE_OPTIONS.map(({ value }) => getVehicleIconSvg(value))).size, 10);
  assert.equal(getVehicleTypeLabel('EV_SCOOTER'), 'EV scooter');
});
test('unknown API values cannot inject markup into map icons', () => {
  for (const value of [null, undefined, '<script>alert(1)</script>', '__proto__', {}]) {
    assert.equal(normalizeVehicleType(value), 'OTHER');
    assert.equal(getVehicleIconSvg(value), getVehicleIconSvg('OTHER'));
  }
});
test('SIM numbers keep leading zeros and missing values have an explicit label', () => {
  assert.equal(formatSimNumber(' 001234567890 '), '001234567890');
  for (const value of [null, undefined, '', ' ']) assert.equal(formatSimNumber(value), 'Not added');
});
