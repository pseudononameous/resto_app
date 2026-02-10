/**
 * validateRequest.js
 * @description :: exports methods for validating parameters of request body using joi validation.
 */

const { FILTER_KEYS } = require('../constants/filterKeys');

exports.validateParamsWithJoi = (payload, schemaKeys) => {
  const { error } = schemaKeys.validate(payload, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return { isValid: false, message };
  }
  return { isValid: true };
};

exports.validateFilterWithJoi = (payload, schemaKeys, modelSchema) => {
  let isValid = true;
  if (modelSchema && payload && (payload.options?.select || payload.select)) {
    const keys = [...Object.keys(modelSchema), ...Object.values(FILTER_KEYS)];
    const selectVal = payload.options?.select || payload.select;
    if (Array.isArray(selectVal)) {
      isValid = selectVal.some((s) => keys.includes(s));
    } else if (typeof selectVal === 'string') {
      const arr = selectVal.split(' ');
      isValid = arr.some((s) => keys.includes(s));
    } else {
      isValid = Object.keys(selectVal || {}).some((s) => keys.includes(s));
    }
    if (!isValid) {
      return { isValid: false, message: 'invalid attributes in options.select' };
    }
  }
  const { error } = schemaKeys.validate(payload, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return { isValid: false, message };
  }
  return { isValid: true };
};
