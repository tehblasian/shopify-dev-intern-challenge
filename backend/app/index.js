import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';

const app = express();

// Create GraphQL schema
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Set up GraphQL endpoint and editor
const graphqlEndpoint = '/api/graphql';
app.use(
    graphqlEndpoint,
    bodyParser.json(),
    graphqlExpress(() => ({
        schema,
    })),
);

app.use('/api/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

app.listen(process.env.PORT, 'backend', () => console.log(`Server listening on port ${process.env.PORT}`));

app.get('/api/', (req, res) => {
    res.send('Hello world!');
});
