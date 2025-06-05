const qs = require('querystring');
const Fastify = require('fastify');

const fastify = Fastify({
    querystringParser: str => qs.parse(str),
    logger: true
});

fastify.get('/', function(request, reply) {
    const queryParams = request.query;
    reply.send({ hello: 'world', query: queryParams });
});

fastify.listen({ port: 3000 }, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
