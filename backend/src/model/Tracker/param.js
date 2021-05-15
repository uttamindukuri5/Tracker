const { trackTable } = require('../../aws/table');
const Action = require('../action');

const generateParam = (type, value) => {
    return {
        TableName: trackTable,
        ...determineParam(type, value)
    };
};

const determineParam = (type, value) => {
    switch (type) {
        case Action.CREATE:
            return generateSaveParam(value);
        case Action.GET:
            return generateSpecificTrackParam(value);
        case Action.UPDATE:
            return generateUpdateParam(value);
        case Action.SEARCH:
            return generateSearchParam(value);
        case Action.GET_USERID:
            return generateUserTrackHisotryParam(value);
        default:
            return;
    }
};

const getExpressionAttributeNames = isID => {
    return isID ?
    {
        ExpressionAttributeNames: {
            '#id': 'id',
            '#userId': 'userId',
            '#counter': 'counter',
            '#date': 'date'
        }
    }
    :
    {
        ExpressionAttributeNames: {
            '#counter': 'counter',
            '#date': 'date'
        }
    };
};

const generateSaveParam = tracker => {
    return {
        Item: {
            'id': tracker.id,
            'userId': tracker.userId,
            'counter': tracker.count,
            'date': tracker.date
        },
        ConditionExpression: 'attribute_not_exists(id)'
    };
};

const generateSpecificTrackParam = id => {
    return {
        Key: {
            'id': id
        }
    };
};

const generateUpdateParam = track => {
    return {
        Key: {
            'id': track.id
        },
        ...getExpressionAttributeNames(false),
        UpdateExpression: 'set #counter = :counter, #date = :date',
        ExpressionAttributeValues: {
            ':counter': track.counter,
            ':date': track.date
        }
    };
};

const generateUserTrackHisotryParam = userId => {
    return {
        FilterExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }
}

const generateSearchParam = search => {
    return {
        FilterExpression: '(contains(#id, :id) or contains(#userId, :userId) or contains(#counter, :counter) or contains(#date, :date))',
        ...getExpressionAttributeNames(true),
        ExpressionAttributeValues: {
            ':id': search,
            ':userId': search,
            ':counter': search,
            ':date': search
        }
    };
};

module.exports = generateParam;
