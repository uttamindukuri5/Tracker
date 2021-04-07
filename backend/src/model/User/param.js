const userTable = require('../../aws/table');
const UserAction = require('./action');

const generateParam = (type, value) => {
    const param = determineParam(type, value);
    return { TableName: userTable, ...param };
}

const determineParam = (type, value) => {
    switch (type) {
        case UserAction.CREATE:
            return generatePostParam(value);
        case UserAction.GET:
            return generateGetUserIdParam(value);
        case UserAction.UPDATE:
            return generateUpdateParam(value);
        case UserAction.SEARCH:
            return generateSearchParam(value);
        default:
            return;
    }
}

const createTableParam = () => {
    return {
        AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'N'
            },
            {
              AttributeName: 'userId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'userId',
              KeyType: 'RANGE'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          TableName: 'Users',
          StreamSpecification: {
            StreamEnabled: false
          }
    }
}

const getExpressionAttributeNames = () => {
    return {
        ExpressionAttributeNames: {
            '#id': 'id',
            '#userId': 'userId',
            '#firstName': 'firstName',
            '#lastName': 'lastName',
            '#email': 'email',
            '#phone': 'phone',
            '#team': 'team',
            '#track': 'track',
        }
    };
}

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
            'track': user.track
        },
        ConditionExpression: 'attribute_not_exists(userId)'
    };
};

const generateGetUserIdParam = ({ user, isId }) => {
    return isId ?
        {
            Key: {
                'id': user
            }
        } :
        {
            Key: {
                'userId': user
            }
        }
};

const generateUpdateParam = user => {
    return {
        Key: {
            'userId': user.previousId
        },
        ...getExpressionAttributeNames(),
        UpdateExpression: 'set userId = :id, firstName = :fn, lastName = :ln, email = :email, phone = :phone, team = :team, track = :track',
        ExpressionAttributeValues: {
            ':id': user.userId,
            ':fn': user.firstName,
            ':ln': user.lastName,
            ':email': user.email,
            ':phone': user.phone,
            ':team': user.team,
            ':track': user.track
        }
    };
};

const generateSearchParam = search => {
    return {
        FilterExpression: '(contains(#userId, :id) or contains(#firstName, :fn) or contains(#lastName, :ln) or contains(#email, :email) or ' +
            'contains(#phone, :phone) or contains(#team, :team) or contains(#track, :track))',
        ...getExpressionAttributeNames(),
        ExpressionAttributeValues: {
            ':id': search,
            ':fn': search,
            ':ln': search,
            ':email': search,
            ':phone': search,
            ':team': search,
            ':track': search,
        }
    };
};

module.exports = generateParam;