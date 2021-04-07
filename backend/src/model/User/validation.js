const validUser = async (user) => validName(user.firstName, user.lastName) && await validUserId(user.userId) && validEmail(user.email) && validPhone(user.phone) && validTeam(user.team);

const validName = (firstName, lastName ) => firstName != '' && lastName != '';

const validUserId = async userId => userId != '' && userId != null && userId != undefined;

const validEmail = ( email ) => {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegex.test(email);
};

const validPhone = ( phone ) => {
    const phoneRegex = /^(\+\d{1,2}\s)?(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|\d{10})$/;
    return phoneRegex.test(phone);
};


const validTeam = team => team != '' && team != null && team != undefined;

module.exports = validUser;

