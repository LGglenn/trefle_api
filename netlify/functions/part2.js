var axios = require('axios');
const Joi = require('joi');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

const schema = Joi.object({
    family_common_name: Joi.string().required()
});

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers,
                body: 'Method Not Allowed'
            };
        } else {

            //verification des entrées api
            await schema.validateAsync(event.queryStringParameters);

            //recupération des plants de l'api trefle
            const plant_list = await axios.get(
                `https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            //verification status du call api get list plant
            if (plant_list.status !== 200) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ message: 'no plants found for this common family name' }),
                };
            };

            //filtrage des plantes avec le family common name demandé
            const data_family = plant_list.data.data.filter(element => element.family_common_name === event.queryStringParameters.family_common_name);

            //verification du nombre de plantes trouvées 
            if (data_family.length <= 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ message: 'no plants found for this common family name' }),
                };
            };

            // formatage de la reponse
            const plant_finded_promise = data_family.map(async (plant) => {

                //get genus
                const plant_genus = axios.get(
                    `https://trefle.io/${plant.links.genus}?token=${process.env.TREFLE_TOKEN}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                //get species
                const plant_species = axios.get(
                    `https://trefle.io/${plant.links.self}?token=${process.env.TREFLE_TOKEN}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                return Promise.all([plant_genus, plant_species])
                    .then(([genus_response, species_response]) => {
                        return {
                            scientific_name: plant.scientific_name,
                            year: plant.year,
                            genus_family_common_name: genus_response.data.data.family.common_name,
                            species_observation: species_response.data.data.observations
                        };
                    })
                    .catch(error => {
                        console.error('Error retrieving data from genius or species', error);
                    });
            });

            return Promise.all(plant_finded_promise)
                .then(result => {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ message: 'success', data: result }),
                    };
                });
        };

    } catch (err) {
        console.log('error:', err);
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify(err),
        };
    }
};
