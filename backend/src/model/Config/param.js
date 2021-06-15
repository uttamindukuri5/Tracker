const { configTable } = require('../../aws/table');
const Action = require('../action');

const generateParam = (type, value) => {
    return {
        TableName: configTable,
        ...determineParam(type, value)
    };
};

const determineParam = (type, value) => {
    switch (type) {
        case Action.CREATE:
            return generateCreateParam(value);
        case Action.GET:
            return generateGetParam(value);
        case Action.UPDATE:
            return generateUpdateParam(value);
        default:
            return;
    }
};

const generateCreateParam = config => {
    return {
        Item: {
            'branch': config.branch,
            'date': config.date,
            'team': config.team,
            'goal': config.goal,
            'title': config.title
        }
    }
}

const generateGetParam = branch => {
    return {
        Key: {
            'branch': branch
        }
    };
};

const generateUpdateParam = config => {
    return {
        Key: {
            'branch': config.branch
        },
        ExpressionAttributeNames: {
            '#date': 'date',
            '#team': 'team',
            '#goal': 'goal',
            '#title': 'title'
        },
        UpdateExpression: 'set #date = :date, #team = :team, #goal = :goal, #title = :title',
        ExpressionAttributeNames: {
            ':date': config.date,
            ':team': config.team,
            ':goal': config.goal,
            ':title': config.title
        }
    };
};

module.exports = generateParam;

