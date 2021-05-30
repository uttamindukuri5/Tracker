const { userTable } = require('../../aws/table');
const UserAction = require('../action');

const generateParam = (type, value) => {
    const param = determineParam(type, value);
    return { TableName: userTable, ...param };
}

const determineParam = (type, value) => {
    switch (type) {
        case UserAction.CREATE:
            return generatePostParam(value);
        case UserAction.GET:
            return generateGetSpecificUserParam(value);
        case UserAction.UPDATE:
            return generateUpdateParam(value);
        case UserAction.SEARCH:
            return generateSearchParam(value);
        case UserAction.GET_USERID:
            return generateGetUserIdParam(value);
        case UserAction.UPDATE_TRACK:
            return generateUpdateTrackParam(value);
        default:
            return;
    }
}

const getExpressionAttributeNames = isId => {
    return isId ?
    {
        ExpressionAttributeNames: {
            '#id': 'id',
            '#userId': 'userId',
            '#firstName': 'firstName',
            '#lastName': 'lastName',
            '#email': 'email',
            '#phone': 'phone',
            '#team': 'team',
            '#track': 'track',
            '#age': 'age'
        }
    }
    :
    {
        ExpressionAttributeNames: {
            '#userId': 'userId',
            '#firstName': 'firstName',
            '#lastName': 'lastName',
            '#email': 'email',
            '#phone': 'phone',
            '#team': 'team',
            '#track': 'track',
            '#age': 'age'
        }
    };
};

const generatePostParam = user => {
    return {
        Item: {
            'id': user.id,
            'userId': user.userId,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'phone': user.phone,
            'team': user.team,
            'track': user.track,
            'password': user.password,
            'age': user.age
        },
        ConditionExpression: 'attribute_not_exists(userId)'
    };
};

const generateGetSpecificUserParam = id => {
    return {
        Key: {
            'id': id
        }
    };
};

const generateGetUserIdParam = userId => {
    return {
            FilterExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }
};

const generateUpdateParam = user => {
    return {
        Key: {
            'id': user.id,
        },
        ...getExpressionAttributeNames(false),
        UpdateExpression: 'set #userId = :userId, #firstName = :fn, #lastName = :ln, #email = :email, #phone = :phone, #team = :team, #track = :track, #age = :age',
        ExpressionAttributeValues: {
            ':userId': user.userId,
            ':fn': user.firstName,
            ':ln': user.lastName,
            ':email': user.email,
            ':phone': user.phone,
            ':team': user.team,
            ':track': user.track,
            ':age': user.age
        }
    };
};

const generateUpdateTrackParam = ({ id, track }) => {
    console.log(id, track);
    return {
        Key: {
            'id': id
        },
        ExpressionAttributeNames: {
            '#track': 'track'
        },
        UpdateExpression: 'set #track = :track',
        ExpressionAttributeValues: {
            ':track': track
        }
    };
};

const generateSearchParam = search => {
    return {
        FilterExpression: '(contains(#id, :id) or contains(#userId, :userId) or contains(#firstName, :fn) or contains(#lastName, :ln) or contains(#email, :email) or ' +
            'contains(#phone, :phone) or contains(#team, :team) or contains(#track, :track) or contains(#age, :age))',
        ...getExpressionAttributeNames(true),
        ExpressionAttributeValues: {
            ':id': search,
            ':userId': search,
            ':fn': search,
            ':ln': search,
            ':email': search,
            ':phone': search,
            ':team': search,
            ':track': search,
            ':age': search
        }
    };
};

module.exports = generateParam;