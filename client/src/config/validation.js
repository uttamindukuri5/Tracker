const validEmail = email => {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegex.test(email);
};

const validPhone = phone => {
    const phoneRegex = /^(\+\d{1,2}\s)?(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|\d{10})$/;
    return phoneRegex.test(phone);
};

exports.validEmail = validEmail;
exports.validPhone = validPhone;